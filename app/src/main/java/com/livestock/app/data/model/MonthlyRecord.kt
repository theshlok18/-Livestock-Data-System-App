package com.livestock.app.data.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "monthly_records",
    foreignKeys = [
        ForeignKey(
            entity = Animal::class,
            parentColumns = ["tagNo"],
            childColumns = ["tagNo"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["tagNo"])]
)
data class MonthlyRecord(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val tagNo: String,
    val recordDate: String, // YYYY-MM-DD
    val milkPerDay: Double = 0.0,
    val fat: Double = 0.0,
    val snf: Double = 0.0,
    val rate: Double = 0.0,
    val expenses: Double = 0.0,
    val healthStatus: String = "Healthy", // Healthy, Under Treatment, Sick, Vaccinated
    val vaccination: String = "",
    val deworming: String = "",
    val pregnancyStatus: String = "Non-Pregnant", // Pregnant, Non-Pregnant, Inseminated
    val pregnancyMonth: Int = 0,
    val lactationNo: Int = 1,
    val dryDate: String = "",
    val calvingDate: String = "",
    val calfTag: String = "",
    val calfSex: String = "", // Male, Female
    val bodyWeight: Double = 0.0,
    val bodyConditionScore: String = "3.0",
    val notes: String = "",
    val milkIncrease: String = "No",
    val milkIncreaseValue: Double = 0.0,
    val challengeFeeding: String = "No",
    val feedingDataJson: String = "[]",
    val isDraft: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)
