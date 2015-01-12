BEGIN;

-- User
CREATE TABLE auth_user (
  user_id integer NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL
);
CREATE SEQUENCE auth_user_seq;
ALTER TABLE auth_user ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);

-- Group
CREATE TABLE auth_group (
  group_id integer NOT NULL,
  name text NOT NULL,
  description text
);
CREATE SEQUENCE auth_group_seq;
ALTER TABLE auth_group ADD CONSTRAINT group_pkey PRIMARY KEY (group_id);
ALTER TABLE auth_group ADD CONSTRAINT group_name_unq UNIQUE (name);

-- Action
CREATE TABLE auth_action (
  action varchar(20)
);
ALTER TABLE auth_action ADD CONSTRAINT action_pkey PRIMARY KEY (action);

-- Permission
CREATE TABLE auth_permission (
  permission_id integer NOT NULL,
  resource text NOT NULL,
  action varchar(20)
);
CREATE SEQUENCE auth_permission_seq;
ALTER TABLE auth_permission ADD CONSTRAINT permission_pkey PRIMARY KEY (permission_id);
ALTER TABLE auth_permission ADD CONSTRAINT permission_action_fkey FOREIGN KEY (action) REFERENCES auth_action(action);
ALTER TABLE auth_permission ADD CONSTRAINT permission_resource_action_unq UNIQUE (resource, action);

-- Group to Permission
CREATE TABLE auth_group_permission (
  group_permission_id integer NOT NULL,
  group_id integer NOT NULL,
  permission_id integer NOT NULL
);
CREATE SEQUENCE auth_group_permission_seq;
ALTER TABLE auth_group_permission ADD CONSTRAINT group_permission_pkey PRIMARY KEY (group_permission_id);
ALTER TABLE auth_group_permission ADD CONSTRAINT group_permission_group_fkey FOREIGN KEY (group_id) REFERENCES auth_group(group_id);
ALTER TABLE auth_group_permission ADD CONSTRAINT group_permission_permission_fkey FOREIGN KEY (permission_id) REFERENCES auth_permission(permission_id);

-- User to Group
CREATE TABLE auth_user_group (
  user_group_id integer NOT NULL,
  user_id integer NOT NULL,
  group_id integer NOT NULL
);
CREATE SEQUENCE auth_user_group_seq;
ALTER TABLE auth_user_group ADD CONSTRAINT user_group_pkey PRIMARY KEY (user_group_id);
ALTER TABLE auth_user_group ADD CONSTRAINT user_group_user_fkey FOREIGN KEY (user_id) REFERENCES auth_user(user_id);
ALTER TABLE auth_user_group ADD CONSTRAINT user_group_group_fkey FOREIGN KEY (group_id) REFERENCES auth_group(group_id);

COMMIT;