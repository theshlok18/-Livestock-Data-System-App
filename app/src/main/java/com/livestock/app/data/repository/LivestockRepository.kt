package com.livestock.app.data.repository

import com.livestock.app.data.local.AnimalDao
import com.livestock.app.data.local.RecordDao
import com.livestock.app.data.model.Animal
import com.livestock.app.data.model.MonthlyRecord
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.flow.Flow

class LivestockRepository(
    private val animalDao: AnimalDao,
    private val recordDao: RecordDao
) {
    val allAnimals: Flow<List<Animal>> = animalDao.getAllAnimals()
    val allRecords: Flow<List<MonthlyRecord>> = recordDao.getAllRecords()
    val drafts: Flow<List<MonthlyRecord>> = recordDao.getDrafts()
    val animalCount: Flow<Int> = animalDao.getAnimalCount()
    val recordCount: Flow<Int> = recordDao.getRecordCount()
    val draftCount: Flow<Int> = recordDao.getDraftCount()
    val averageMilk: Flow<Double?> = recordDao.getAverageMilk()
    val totalExpenses: Flow<Double?> = recordDao.getTotalExpenses()

    fun searchAnimals(query: String): Flow<List<Animal>> = animalDao.searchAnimals(query)

    suspend fun getAnimalByTag(tagNo: String): Animal? = animalDao.getAnimalByTag(tagNo)

    fun getRecordsForAnimal(tagNo: String): Flow<List<MonthlyRecord>> =
        recordDao.getRecordsForAnimal(tagNo)

    suspend fun insertAnimal(animal: Animal) = animalDao.insertAnimal(animal)

    suspend fun updateAnimal(animal: Animal) = animalDao.updateAnimal(animal)

    suspend fun deleteAnimal(animal: Animal) = animalDao.deleteAnimal(animal)

    suspend fun deleteAnimalByTag(tagNo: String) = animalDao.deleteAnimalByTag(tagNo)

    suspend fun insertRecord(record: MonthlyRecord): Long = recordDao.insertRecord(record)

    suspend fun updateRecord(record: MonthlyRecord) = recordDao.updateRecord(record)

    suspend fun deleteRecord(record: MonthlyRecord) = recordDao.deleteRecord(record)

    suspend fun deleteRecordById(id: Long) = recordDao.deleteRecordById(id)

    suspend fun getRecordById(id: Long): MonthlyRecord? = recordDao.getRecordById(id)

    // Export local phone storage to JSON backup
    fun exportBackupJson(animals: List<Animal>, records: List<MonthlyRecord>): String {
        val gson = Gson()
        val backupMap = mapOf(
            "version" to 1,
            "timestamp" to System.currentTimeMillis(),
            "animals" to animals,
            "records" to records
        )
        return gson.toJson(backupMap)
    }

    // Import backup JSON into local phone storage
    suspend fun importBackupJson(jsonString: String): Boolean {
        return try {
            val gson = Gson()
            val mapType = object : TypeToken<Map<String, Any>>() {}.type
            val data: Map<String, Any> = gson.fromJson(jsonString, mapType)

            val animalsJson = gson.toJson(data["animals"])
            val recordsJson = gson.toJson(data["records"])

            val animalListType = object : TypeToken<List<Animal>>() {}.type
            val recordListType = object : TypeToken<List<MonthlyRecord>>() {}.type

            val animals: List<Animal> = gson.fromJson(animalsJson, animalListType) ?: emptyList()
            val records: List<MonthlyRecord> = gson.fromJson(recordsJson, recordListType) ?: emptyList()

            for (a in animals) {
                animalDao.insertAnimal(a)
            }
            for (r in records) {
                recordDao.insertRecord(r)
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
