package com.livestock.app.data.local

import androidx.room.*
import com.livestock.app.data.model.Animal
import kotlinx.coroutines.flow.Flow

@Dao
interface AnimalDao {
    @Query("SELECT * FROM animals ORDER BY createdAt DESC")
    fun getAllAnimals(): Flow<List<Animal>>

    @Query("SELECT * FROM animals WHERE tagNo = :tagNo LIMIT 1")
    suspend fun getAnimalByTag(tagNo: String): Animal?

    @Query("SELECT * FROM animals WHERE tagNo LIKE '%' || :query || '%' OR ownerName LIKE '%' || :query || '%' OR village LIKE '%' || :query || '%'")
    fun searchAnimals(query: String): Flow<List<Animal>>

    @Query("SELECT COUNT(*) FROM animals")
    fun getAnimalCount(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnimal(animal: Animal)

    @Update
    suspend fun updateAnimal(animal: Animal)

    @Delete
    suspend fun deleteAnimal(animal: Animal)

    @Query("DELETE FROM animals WHERE tagNo = :tagNo")
    suspend fun deleteAnimalByTag(tagNo: String)
}
