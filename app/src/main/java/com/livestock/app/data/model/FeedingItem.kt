package com.livestock.app.data.model

data class FeedingItem(
    val id: String = "",
    val feedType: String = "Concentrates", // Concentrates, Green Fodder, Dry Fodder, Mineral Mixture, Supplements
    val feedName: String = "",
    val quantityKg: Double = 0.0,
    val costPerKg: Double = 0.0,
    val totalCost: Double = 0.0,
    val feedingTime: String = "Morning & Evening"
)
