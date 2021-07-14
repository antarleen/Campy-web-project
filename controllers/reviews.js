const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success', 'Your review has been added !')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success', 'Your review has been deleted !')
    res.redirect(`/campgrounds/${id}`)
}