DELETE FROM igcdlog;
DELETE FROM igcelog;
DELETE FROM igcfab;
DELETE FROM igcinst;
DELETE FROM igcinstl;
DELETE FROM igclexp;
DELETE FROM igclimp;
DELETE FROM igcslog;
DELETE FROM igctlog;
DELETE FROM igcsnap;
DELETE FROM igcum;

DELETE FROM igcmc WHERE pstatus=2 OR pstatus=3;

SELECT CONCAT(HEX(uid1), '-', HEX(uid2)) FROM igcmcd WHERE mctype=60 and seq=0 and concat(hex(uid1), '-', hex(uid2)) not in ('134c2c0-1a80789', '134896c-1760da2', '1346dd1-152e972', '1349334-1c005bb', '1346dd3-1c6a807', '13472c6-1b55ad2', '1359634-133ad30', '135CBF0-168F969');