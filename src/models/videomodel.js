import mongoose, { Schema } from "mongoose";


const videoSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
        default: "https://imgs.search.brave.com/kuEI4TE7AY8Nd5BBwaVrrHgJaFch7jNZtxkBe-eGuDU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IveW91dHViZS10/aHVtYm5haWwtcHJv/ZmVzc2lvbmFsLWd5/bS1maXRuZXNzLW9u/bGluZS1lYXJuaW5n/LW1vbmV5LWdhbWVz/LWludGVydmlldy1w/b2RjYXN0LWJ1c2lu/ZXNzLWtleV82NDI1/MTQtMTIwLmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA"
    },
    controls: {
        type: Boolean,
        default: true,
    },
    transformations: {
        height: {
            type: Number,
            default: 1080
        },
        width: {
            type: Number,
            default: 1920
        },
        quality: {
            type: Number,
            min: 1,
            max: 100
        }
    },
}, {
    timestamps: true
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;
