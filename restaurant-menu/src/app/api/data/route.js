import { NextResponse } from "next/server";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";


export const runtime = 'edge';

export const dynamic = 'force-dynamic';


export async function GET(req) {
    const credentials = new S3Client({
        region: "auto",
        endpoint: process.env.endpoint ?? "",
        credentials: {
            accessKeyId: process.env.accessKeyId ?? "",
            secretAccessKey: process.env.secretAccessKey ?? ""
        }
    })
    const requeredFile = new GetObjectCommand({
        Bucket: "lavenesj",
        Key: "dataGrande.json",
    });

    try {
        const response = await credentials.send(requeredFile);
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        const str = await response.Body.transformToString();
        // console.log(JSON.parse(str)[0]);
        return NextResponse.json({ message: 'Enviado', body: str });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "No se pudo enviar la data" }, { status: 400 });
    }

}







