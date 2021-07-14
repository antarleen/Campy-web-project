const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_200')
})

const opts = { toJSON: { virtuals: true } }

const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts)

campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description}</p>`
})

campgroundSchema.post('findOneAndDelete', async(campground) => {
    if (campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        console.log(res)
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)