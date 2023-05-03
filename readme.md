# Description
The objective of this project is to provide a developer with the tools to buiild and deploy a backend service that can be used to identify recyclables. 

# Quick Start
1. First install `serverless` cli globally through `npm install -g serverless`
2. Open terminal and execute ``git clone <https clone url>``
3. `cd` into project folder and execute `npm install`
4. Set AWS credentials for this project through the following command `serverless config credentials --provider aws --key <your-key> --secret <your-secret> --profile smart-recycling`
5. Install `aws` cli and create a profile titled `smart-recycling`
6. Finally deploy to AWS `serverless deploy --aws-profile smart-recycling`
7. Once deployed endpoints will be returned in the terminal that you can be used with the following documentation.

# REST End Point Documentation

| Endpoint | Purpose                                                     | Type  | Params | Body                   | Response                                                   |
|:---------|:------------------------------------------------------------|:------|:-------|:-----------------------|:-----------------------------------------------------------|
|/healthCheck| Validate that the users service is live                     | GET   | None   | None                   | Success                                                    |
|/upload| Upload files to a S3 bucket to store for Rekognition        | POST  | None   | coming soon            | coming soon                                                |
|/getAllFiles| Export a list of all available images from S3 upload bucket | GET   | None   | None                   | ```{"files": [],"bucketName": "","subFolder": "upload"}``` |
|/detectLabel| Submit an image for analysis to Rekognition                 | POST | NONE   | ```{"fileName": ""}``` | ```{"details": []}```                                      |

# Citations / Resources Used
- [AWS Rekognition Documentation](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html) by AWS
- [Serverless documentation](https://www.serverless.com/cloud/docs) by Serverless
- [Uploading Images to AWS S3 with Serverless](https://dev.to/foqc/uploading-images-to-aws-s3-with-serverless-1ae0) by Fabian Quijosaca
- [Flutter and AWS](https://medium.com/codechai/flutter-and-aws-cd7dabc06301) by Aseem Wangoo
- [Image and Text Rekognition in Flutter using AWS](https://medium.com/codechai/image-and-text-rekognition-in-flutter-using-aws-5e1251cf18cb) by Aseem Wangoo