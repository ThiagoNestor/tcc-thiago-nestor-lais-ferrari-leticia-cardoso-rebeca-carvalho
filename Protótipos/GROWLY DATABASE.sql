drop database if exists growly;
create database growly;
use growly;

CREATE TABLE USUARIO (
	id int unique primary key,
	nome varchar(400),
	email text,
	ursn varchar(20),
	senha int(8) unique
);

CREATE TABLE PANC(
	id_panc int unique primary key,
	n_PANC varchar(111),
	infos text,
	categ varchar(100)
);

CREATE TABLE IDENTIFICACAO(
	id_iden int unique primary key,

	id int,
	id_panc int,
	foreign key (id) references USUARIO(id),
	foreign key (id_panc) references PANC(id_panc),

	dat date,
	hora time,
	padr text,
	p_d_conf int
);

CREATE TABLE JARDIM (
	id_jardim int unique primary key,

	id int,
	foreign key (id) references USUARIO(id),

	resg text
);

CREATE TABLE JARDIM_PANC(
	id_jardim int,
	id_panc int,
	foreign key (id_jardim) references JARDIM(id_jardim),
	foreign key (id_panc) references PANC(id_panc),

	quantidade text,
	dat_add date
);

CREATE TABLE MENSAGEM(
	id_msg int unique primary key,

	id int,
	id_iden int,
	foreign key (id) references USUARIO(id),
	foreign key (id_iden) references IDENTIFICACAO(id_iden),

	txt text,
	resp text,
	dat date,
	hora time
);