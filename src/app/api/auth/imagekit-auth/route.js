// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {

    try {
        const authenticationParams = getUploadAuthParams({   //token, expire, signature
            privateKey: process.env.NEXT_PRIVATE_KEY,
            publicKey: process.env.NEXT_PUBLIC_KEY

        })

        return Response.json({ authenticationParams, publicKey: process.env.NEXT_PUBLIC_KEY })//authenticationParams==//token, expire, signature
    } catch (error) {
        return Response.json(
            {
                error: "Authentication for image kit faild"
            },
            { status: 500 }
        )

    }
}