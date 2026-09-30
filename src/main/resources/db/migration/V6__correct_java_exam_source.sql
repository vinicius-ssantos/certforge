-- Corrects the official source of the seeded Java certification (see V4).
--
-- V4 recorded https://education.oracle.com/java-se-21-developer/pexam_1Z0-830, an alias. The
-- canonical URL declared by Oracle's own page metadata is the one below. The certification name
-- now follows the wording of Oracle University's announcement of the exam. V4 is left unchanged
-- because Flyway checksums applied migrations.

UPDATE certforge.catalog_exam_version
   SET objectives_url = 'https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830'
 WHERE id = 'a2000000-0000-4000-8000-000000000001';

UPDATE certforge.catalog_certification_profile
   SET certification_name = 'Oracle Certified Professional Java SE 21 Developer'
 WHERE track_id = 'a1000000-0000-4000-8000-000000000001';
