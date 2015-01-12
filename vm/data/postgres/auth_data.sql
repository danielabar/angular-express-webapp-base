BEGIN;

-- Users
INSERT INTO auth_user (user_id, username, email, first_name, last_name) VALUES (nextval('auth_user_seq'), 'jdoe', 'john.doe@test.foo', 'John', 'Doe');
INSERT INTO auth_user (user_id, username, email, first_name, last_name) VALUES (nextval('auth_user_seq'), 'bsmith', 'bob.smith@test.foo', 'Bob', 'Smith');

-- Groups
INSERT INTO auth_group (group_id, name, description) VALUES (nextval('auth_group_seq'), 'USER', 'Simple user level access');
INSERT INTO auth_group (group_id, name, description) VALUES (nextval('auth_group_seq'), 'ADMIN', 'System Administrator');

-- Actions
INSERT INTO auth_action (action) VALUES ('GET');
INSERT INTO auth_action (action) VALUES ('POST');
INSERT INTO auth_action (action) VALUES ('PUT');
INSERT INTO auth_action (action) VALUES ('DELETE');

-- Permissions
INSERT INTO auth_permission (permission_id, resource, action) VALUES (nextval('auth_permission_seq'), 'country', 'GET');
INSERT INTO auth_permission (permission_id, resource, action) VALUES (nextval('auth_permission_seq'), 'country', 'POST');
INSERT INTO auth_permission (permission_id, resource, action) VALUES (nextval('auth_permission_seq'), 'country', 'PUT');
INSERT INTO auth_permission (permission_id, resource, action) VALUES (nextval('auth_permission_seq'), 'country', 'DELETE');

-- Groups to Permissions
INSERT INTO auth_group_permission (group_permission_id, group_id, permission_id) VALUES
  (nextval('auth_group_permission_seq'),
  (SELECT group_id FROM auth_group WHERE name = 'USER'),
  (SELECT permission_id FROM auth_permission WHERE resource = 'country' AND action = 'GET'));
INSERT INTO auth_group_permission (group_permission_id, group_id, permission_id) VALUES
  (nextval('auth_group_permission_seq'),
  (SELECT group_id FROM auth_group WHERE name = 'ADMIN'),
  (SELECT permission_id FROM auth_permission WHERE resource = 'country' AND action = 'GET'));
INSERT INTO auth_group_permission (group_permission_id, group_id, permission_id) VALUES
  (nextval('auth_group_permission_seq'),
  (SELECT group_id FROM auth_group WHERE name = 'ADMIN'),
  (SELECT permission_id FROM auth_permission WHERE resource = 'country' AND action = 'POST'));
INSERT INTO auth_group_permission (group_permission_id, group_id, permission_id) VALUES
  (nextval('auth_group_permission_seq'),
  (SELECT group_id FROM auth_group WHERE name = 'ADMIN'),
  (SELECT permission_id FROM auth_permission WHERE resource = 'country' AND action = 'PUT'));
INSERT INTO auth_group_permission (group_permission_id, group_id, permission_id) VALUES
  (nextval('auth_group_permission_seq'),
  (SELECT group_id FROM auth_group WHERE name = 'ADMIN'),
  (SELECT permission_id FROM auth_permission WHERE resource = 'country' AND action = 'DELETE'));

-- Users to Groups
INSERT INTO auth_user_group (user_group_id, user_id, group_id) VALUES
  (nextval('auth_user_group_seq'),
   (SELECT user_id FROM auth_user where username = 'jdoe'),
   (SELECT group_id FROM auth_group where name = 'USER'));
INSERT INTO auth_user_group (user_group_id, user_id, group_id) VALUES
  (nextval('auth_user_group_seq'),
   (SELECT user_id FROM auth_user where username = 'bsmith'),
   (SELECT group_id FROM auth_group where name = 'ADMIN'));

COMMIT;