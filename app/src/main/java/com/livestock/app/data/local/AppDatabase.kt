package com.livestock.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.livestock.app.data.model.Animal
import com.livestock.app.data.model.MonthlyRecord
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [Animal::class, MonthlyRecord::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun animalDao(): AnimalDao
    abstract fun recordDao(): RecordDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "livestock_local_storage.db"
                )
                .fallbackToDestructiveMigration()
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database.animalDao(), database.recordDao())
                    }
                }
            }

            suspend fun populateInitialData(animalDao: AnimalDao, recordDao: RecordDao) {
                // Seed sample local animals
                val animal1 = Animal(
                    tagNo = "TAG-1001",
                    animalType = "Cow",
                    breed = "HF Cross",
                    age = "3 Years 6 Months",
                    bodyWeight = 420.0,
                    ownerName = "Pralhad Patil",
                    village = "Arjunwada",
                    contact = "9876543210",
                    mobileNo = "9876543210",
                    aadharNo = "1234 5678 9012"
                )
                val animal2 = Animal(
                    tagNo = "TAG-1002",
                    animalType = "Buffalo",
                    breed = "Murrah",
                    age = "4 Years 2 Months",
                    bodyWeight = 550.0,
                    ownerName = "Ramesh Shinde",
                    village = "Kagal",
                    contact = "9823456789",
                    mobileNo = "9823456789",
                    aadharNo = "9876 5432 1098"
                )
                val animal3 = Animal(
                    tagNo = "TAG-1003",
                    animalType = "Cow",
                    breed = "Gir",
                    age = "2 Years 8 Months",
                    bodyWeight = 380.0,
                    ownerName = "Sunil Gaikwad",
                    village = "Arjunwada",
                    contact = "9765432190",
                    mobileNo = "9765432190",
                    aadharNo = "4567 8901 2345"
                )

                animalDao.insertAnimal(animal1)
                animalDao.insertAnimal(animal2)
                animalDao.insertAnimal(animal3)

                // Seed sample monthly records
                val record1 = MonthlyRecord(
                    tagNo = "TAG-1001",
                    recordDate = "2026-10-01",
                    milkPerDay = 16.5,
                    fat = 4.2,
                    snf = 8.6,
                    rate = 38.5,
                    expenses = 180.0,
                    healthStatus = "Healthy",
                    vaccination = "FMD (Done)",
                    deworming = "Albendazole (Done)",
                    pregnancyStatus = "Pregnant",
                    pregnancyMonth = 4,
                    lactationNo = 2,
                    calvingDate = "2026-02-14",
                    calfTag = "CLF-089",
                    calfSex = "Female",
                    bodyWeight = 420.0,
                    bodyConditionScore = "3.5",
                    notes = "High production, healthy appetite",
                    feedingDataJson = """[{"feedType":"Concentrates","feedName":"Cattle Feed 20%","quantityKg":4.0,"costPerKg":28.0,"totalCost":112.0},{"feedType":"Green Fodder","feedName":"Maize / Napier","quantityKg":20.0,"costPerKg":2.5,"totalCost":50.0},{"feedType":"Mineral Mixture","feedName":"Chelated Agrimin","quantityKg":0.1,"costPerKg":180.0,"totalCost":18.0}]"""
                )
                val record2 = MonthlyRecord(
                    tagNo = "TAG-1002",
                    recordDate = "2026-10-03",
                    milkPerDay = 12.0,
                    fat = 7.1,
                    snf = 9.2,
                    rate = 62.0,
                    expenses = 210.0,
                    healthStatus = "Healthy",
                    vaccination = "HS & BQ (Done)",
                    deworming = "Ivermectin",
                    pregnancyStatus = "Inseminated",
                    pregnancyMonth = 1,
                    lactationNo = 3,
                    bodyWeight = 550.0,
                    bodyConditionScore = "4.0",
                    notes = "Excellent fat percentage recorded",
                    feedingDataJson = """[{"feedType":"Concentrates","feedName":"Cottonseed Cake","quantityKg":3.5,"costPerKg":34.0,"totalCost":119.0},{"feedType":"Green Fodder","feedName":"Lucerne / Grass","quantityKg":25.0,"costPerKg":3.0,"totalCost":75.0},{"feedType":"Mineral Mixture","feedName":"Mineral Mix Super","quantityKg":0.1,"costPerKg":160.0,"totalCost":16.0}]"""
                )

                recordDao.insertRecord(record1)
                recordDao.insertRecord(record2)
            }
        }
    }
}
