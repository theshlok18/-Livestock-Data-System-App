package com.livestock.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "animals")
data class Animal(
    @PrimaryKey
    val tagNo: String,
    val animalType: String = "Cow", // Cow, Buffalo, Goat, Sheep
    val breed: String = "",
    val age: String = "",
    val bodyWeight: Double = 0.0,
    val ownerName: String = "",
    val village: String = "",
    val contact: String = "",
    val mobileNo: String = "",
    val aadharNo: String = "",
    val imageUri: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
