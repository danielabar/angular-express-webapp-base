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
ALTER TABLE ONLY auth_user ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);

-- Group
CREATE TABLE auth_group (
  group_id integer NOT NULL,
  name text NOT NULL,
  description text
);
CREATE SEQUENCE auth_group_seq;
ALTER TABLE ONLY auth_role ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);

-- Role
CREATE TABLE auth_role (
  role_id integer NOT NULL,
  name text NOT NULL,
  description text
);
CREATE SEQUENCE auth_role_seq;
ALTER TABLE ONLY auth_role ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);

-- Action
CREATE TABLE auth_action (
  action varchar(20)
);
ALTER TABLE ONLY auth_action ADD CONSTRAINT action_pkey PRIMARY KEY (action);
INSERT INTO auth_action (action) VALUES('GET');
INSERT INTO auth_action (action) VALUES('POST');
INSERT INTO auth_action (action) VALUES('PUT');
INSERT INTO auth_action (action) VALUES('DELETE');
INSERT INTO auth_action (action) VALUES('PATCH');

-- Permission
CREATE TABLE auth_permission (
  permission_id integer NOT NULL,
  name text NOT NULL,
  resource text NOT NULL,
  action varchar(20)
);
CREATE SEQUENCE auth_permission_seq;
ALTER TABLE ONLY auth_permission ADD CONSTRAINT permission_pkey PRIMARY KEY (permission_id);
ALTER TABLE ONLY auth_permission ADD CONSTRAINT auth_permission_action_fkey FOREIGN KEY (action) REFERENCES auth_action(action);

-- Role to Permission Relationship
CREATE TABLE auth_role_permission (
  role_permission_id,
  role_id,
  permission_id
);
CREATE SEQUENCE auth_role_permission_seq;


COMMIT;