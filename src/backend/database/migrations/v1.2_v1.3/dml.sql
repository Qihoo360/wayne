INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('127', 'HPA_CREATE', '', now(), now());
INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('128', 'HPA_UPDATE', '', now(), now());
INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('129', 'HPA_READ', '', now(), now());
INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('130', 'HPA_DELETE', '', now(), now());
INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('131', 'HPA_DEPLOY', '', now(), now());

INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '127');
INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '128');
INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '129');
INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '130');
INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '131');

INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '128');

INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '129');
INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '131');
INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '129');
INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '131');
