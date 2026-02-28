import { auth } from "@/lib/auth";
import mongoConnect from "@/lib/db";
import Video from "@/models/videomodel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await mongoConnect();
        const videos = await Video.find({}).populate("userId", "email").sort({ createdAt: -1 }).lean();
        return NextResponse.json(videos);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "failed to fetch videos" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await auth(); // for authentication
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        await mongoConnect();

        const body = await request.json(); // data comes from client

        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json(
                { error: "missing required fields" },
                { status: 400 }
            );
        }

        const videoData = {
            ...body,
            userId: session.user.id, // associate with the logged in user
            controls: body?.controls ?? true,
            transformations: {
                height: 1920,
                width: 1080,
                quality: body.transformations?.quality ?? 100
            }
        };

        const newVideo = await Video.create(videoData);
        return NextResponse.json(newVideo);

    } catch (error) {
        console.error("failed to create video", error);
        return NextResponse.json(
            { error: "failed to create video" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const videoId = url.searchParams.get("id");

        if (!videoId) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        await mongoConnect();

        const video = await Video.findById(videoId);

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        if (video.userId.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden - You do not own this video" }, { status: 403 });
        }

        await Video.findByIdAndDelete(videoId);

        return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete error", error);
        return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
    }
}
