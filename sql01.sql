SELECT longitude, latitude, name, longitude, latitude, geom
FROM public.csv_import_1613448864204
limit 20;

ALTER TABLE csv_import_1613448864204 DROP COLUMN geom;

ALTER TABLE csv_import_1613448864204 ADD COLUMN geom point;

alter table csv_import_1613448864204 alter column latitude type double precision using latitude::double precision;
alter table csv_import_1613448864204 alter column longitude type double precision using longitude::double precision;

UPDATE csv_import_1613448864204 SET geom = ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326);

SELECT longitude, latitude, name, ST_MAKEPOINT(longitude::double precision, latitude::double precision) as geom
FROM public.csv_import_1613448864204
limit 20;

SELECT ST_MakePoint(-71.1043443253471, 42.3150676015829);

SELECT ST_MakePoint No function matches the given name and argument types. You might need to add explicit type casts

SELECT ST_SetSRID(ST_MakePoint(-71.1043443253471, 42.3150676015829),4326);