SELECT longitude, latitude, name, longitude, latitude, geom
FROM public.csv_import_1613448864204
limit 20;

ALTER TABLE csv_import_1613448864204 DROP COLUMN geom;

ALTER TABLE csv_import_1613448864204 ADD COLUMN geom point;

https://postgis.net/install/
CREATE EXTENSION postgis;

SELECT longitude, latitude, name, ST_MAKEPOINT(longitude::double precision, latitude::double precision) as geom
FROM public.csv_import_1613448864204
limit 20;

SELECT ST_MakePoint(-71.1043443253471, 42.3150676015829);

SELECT ST_MakePoint No function matches the given name and argument types. You might need to add explicit type casts

SELECT ST_SetSRID(ST_MakePoint(-71.1043443253471, 42.3150676015829),4326);