import boto
import boto.s3.connection
access_key = 'AKIAJNFVCEEAEVW7PXGQ'
secret_key = '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'

conn = boto.connect_s3(
        aws_access_key_id = access_key,
        aws_secret_access_key = secret_key,
        #is_secure=False,               # uncomment if you are not using ssl
        calling_format = boto.s3.connection.OrdinaryCallingFormat(),
       ) 

for bucket in conn.get_all_buckets():
        print "{name}\t{created}".format(
                name = bucket.name,
                created = bucket.creation_date,
        )
bucket = conn.create_bucket('dhlabstestbucket')
