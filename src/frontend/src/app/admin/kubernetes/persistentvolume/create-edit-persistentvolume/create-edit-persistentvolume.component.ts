import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MessageHandlerService } from '../../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../../shared/shared.const';
import { CephFSVolumeSource, PersistentVolume, RBDVolumeSource } from '../../../../shared/model/v1/kubernetes/persistentvolume';
import { PersistentVolumeClient } from '../../../../shared/client/v1/kubernetes/persistentvolume';
import { ActivatedRoute, Router } from '@angular/router';
import { ClusterService } from '../../../../shared/client/v1/cluster.service';
import { Observable } from 'rxjs/Observable';
import { Cluster } from '../../../../shared/model/v1/cluster';
import { AceEditorMsg } from '../../../../shared/ace-editor/ace-editor';
import { AceEditorService } from '../../../../shared/ace-editor/ace-editor.service';

@Component({
  selector: 'create-edit-persistentvolume',
  templateUrl: 'create-edit-persistentvolume.component.html',
  styleUrls: ['create-edit-persistentvolume.scss'],
  providers: [AceEditorService]
})
export class CreateEditPersistentVolumeComponent implements OnInit {
  cluster: Cluster;

  currentForm: FormGroup;

  pv: PersistentVolume;
  checkOnGoing: boolean;
  isSubmitOnGoing: boolean;
  title: string;
  actionType: ActionType;



  constructor(private persistentVolumeClient: PersistentVolumeClient,
              private clusterService: ClusterService,
              private fb: FormBuilder,
              private location: Location,
              private aceEditorService: AceEditorService,
              private route: ActivatedRoute,
              private router: Router,
              private messageHandlerService: MessageHandlerService) {
  }

  defaultPv() {
    const pv = `{
  "metadata": {
    "name": "",
    "labels": {}
  },
  "spec": {
    "capacity": {
      "storage": "10Gi"
    },
    "accessModes": [
      "ReadWriteOnce"
    ],
    "persistentVolumeReclaimPolicy": "Retain"
  }
}`;
    return JSON.parse(pv);
  }

  initForm() {
    this.currentForm = this.fb.group({
      name: '',
      rbdImage: '',
      cephfsPath: '',
      type: 'rbd',
      storage: '10',
      accessModes: this.fb.group({
        ReadWriteOnce: false,
        ReadOnlyMany: false,
        ReadWriteMany: false,
      }),
      labels: this.fb.array([this.initLabel()])
    });

  }

  ngOnInit(): void {
    this.initForm();
    const cluster = this.route.snapshot.params['cluster'];
    const name = this.route.snapshot.params['name'];
    const observables = Array(
      this.clusterService.getByName(cluster)
    );
    if (name) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑PV';
      observables.push(this.persistentVolumeClient.getById(name, cluster));
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建PV';
    }
    Observable.combineLatest(
      observables
    ).subscribe(
      response => {
        this.cluster = response[0].data;
        if (response[1]) {
          this.pv = response[1].data;
          this.savePv(this.pv);
        }

      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  initLabel() {
    return this.fb.group({
      key: 'wayne.cloud/storage-type',
      value: 'ceph',
    });
  }

  get labels(): FormArray {
    return this.currentForm.get('labels') as FormArray;
  };

  onAddLabel(index: number) {
    const selectors = this.currentForm.get(`labels`) as FormArray;
    selectors.push(this.fb.group({
      key: '',
      value: '',
    }));
  }

  onDeleteLabel(index: number) {
    if (this.labels.controls.length <= 1) {
      return;
    }
    this.labels.removeAt(index);
  }

  openModal(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.getPvByForm(), true));
  }

  getPvByForm() {
    const formValue = this.currentForm.value;
    const kubePv = this.pv ? this.pv : this.defaultPv();
    kubePv.metadata.name = formValue.name;
    if (formValue.labels && formValue.labels.length > 0) {
      for (const label of formValue.labels) {
        kubePv.metadata.labels[label.key] = label.value;
      }
    }
    kubePv.spec.capacity['storage'] = formValue.storage + 'Gi';
    const metaData = JSON.parse(this.cluster.metaData ? this.cluster.metaData : '{}');
    switch (formValue.type) {
      case 'rbd':
        kubePv.spec.rbd = kubePv.spec.rbd ? kubePv.spec.rbd : new RBDVolumeSource();
        if (metaData.rbd) {
          Object.getOwnPropertyNames(metaData.rbd).map(key => {
            if (key) {
              kubePv.spec.rbd[key] = metaData.rbd[key];
            }
          });
        }
        kubePv.spec.rbd.image = formValue.rbdImage;
        kubePv.spec.cephfs = undefined;
        break;
      case 'cephfs':
        kubePv.spec.cephfs = kubePv.spec.cephfs ? kubePv.spec.cephfs : new CephFSVolumeSource();
        if (metaData.cephfs) {
          Object.getOwnPropertyNames(metaData.cephfs).map(key => {
            if (key) {
              kubePv.spec.cephfs[key] = metaData.cephfs[key];
            }
          });
        }
        kubePv.spec.cephfs.path = formValue.cephfsPath;
        kubePv.spec.rbd = undefined;
        break;
    }

    const accessModes = Array<string>();
    if (formValue.accessModes.ReadWriteOnce) {
      accessModes.push('ReadWriteOnce');
    }
    if (formValue.accessModes.ReadOnlyMany) {
      accessModes.push('ReadOnlyMany');
    }
    if (formValue.accessModes.ReadWriteMany) {
      accessModes.push('ReadWriteMany');
    }
    kubePv.spec.accessModes = accessModes;

    return kubePv;
  }

  savePv(pv: PersistentVolume) {
    if (pv && pv.spec) {
      this.pv = pv;
      let storage;
      if (pv.spec.capacity) {
        storage = parseFloat(pv.spec.capacity['storage']);
      }
      let readWriteOnce = false;
      let readOnlyMany = false;
      let readWriteMany = false;
      if (pv.spec.accessModes && pv.spec.accessModes.length > 0) {
        pv.spec.accessModes.map(key => {
          switch (key) {
            case 'ReadWriteOnce':
              readWriteOnce = true;
              break;
            case 'ReadOnlyMany':
              readOnlyMany = true;
              break;
            case 'ReadWriteMany':
              readWriteMany = true;
              break;
          }
        });
      }
      const labels = Array<FormGroup>();
      if (pv.metadata.labels) {
        Object.getOwnPropertyNames(pv.metadata.labels).map(key => {
          labels.push(this.fb.group({
            key: key,
            value: pv.metadata.labels[key]
          }));
        });
      }
      let type = '0';
      if (pv.spec.cephfs) {
        type = 'cephfs';
      } else if (pv.spec.rbd) {
        type = 'rbd';
      }

      this.currentForm = this.fb.group({
        name: pv.metadata.name,
        type: type,
        storage: storage,
        rbdImage: pv.spec.rbd ? pv.spec.rbd.image : '',
        cephfsPath: pv.spec.cephfs ? pv.spec.cephfs.path : '',
        accessModes: this.fb.group({
          ReadWriteOnce: readWriteOnce,
          ReadOnlyMany: readOnlyMany,
          ReadWriteMany: readWriteMany,
        }),
        labels: this.fb.array(labels)
      });
    }
  }

  onCancel() {
    this.currentForm.reset();
    this.location.back();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.pv = this.getPvByForm();

    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.persistentVolumeClient.create(this.pv, this.cluster.name).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.messageHandlerService.showSuccess('创建持久化存储成功！');
            this.router.navigate([`/admin/kubernetes/persistentvolume/${this.cluster.name}`]);
          },
          error => {
            this.isSubmitOnGoing = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.persistentVolumeClient.update(this.pv, this.cluster.name).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.messageHandlerService.showSuccess('更新持久化存储成功！');
            this.router.navigate([`/admin/kubernetes/persistentvolume/${this.cluster.name}`]);
          },
          error => {
            this.isSubmitOnGoing = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
    }
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !this.checkOnGoing;
  }

}

