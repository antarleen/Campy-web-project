const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected !')
})

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const price = Math.floor(Math.random() * 20) + 10

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: '60d2071e7fe41e5bbc799192',
            location: `${cities[random1000].city},${cities[random1000].state} `,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                    url: 'https://res.cloudinary.com/dpvvgtspj/image/upload/v1624965617/Yelpcamp/wbbcwvldii1mlrat05kp.jpg',
                    filename: 'Yelpcamp/wbbcwvldii1mlrat05kp'
                },
                {
                    url: 'https://res.cloudinary.com/dpvvgtspj/image/upload/v1624965620/Yelpcamp/kl4uuws9dxe7tvqp9tsg.jpg',
                    filename: 'Yelpcamp/kl4uuws9dxe7tvqp9tsg'
                }
            ],
            description: 'Best camp in the area !!',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }

        })
        await camp.save();
    }
}

seedDB().then(() => {
        mongoose.connection.close()
    })
    .catch(() => {
        console.log('Cannot close database!')
    })