import {Bucket, StackContext} from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {RemovalPolicy} from "aws-cdk-lib";

export function ImageResizingStack({stack}: StackContext) {
    // Create a new bucket
    const bucket = new Bucket(stack, "Bucket", {
        cdk: {
            bucket: {
                removalPolicy: RemovalPolicy.DESTROY,
                publicReadAccess: true,
                autoDeleteObjects: true,
            }
        },
        notifications: {
            resize: {
                function: {
                    handler: "packages/functions/src/resize.main",
                    nodejs: {
                        esbuild: {
                            external: ["sharp"],
                        },
                    },
                    layers: [
                        new lambda.LayerVersion(stack, "SharpLayer", {
                            code: lambda.Code.fromAsset("layers/sharp"),
                        }),
                    ],
                },
                events: ["object_created"],
            },
        },
    });

    // Allow the notification functions to access the bucket
    bucket.attachPermissions([bucket]);

    // Show the endpoint in the output
    stack.addOutputs({
        BucketName: bucket.bucketName,
    });
}