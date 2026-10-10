package com.livestock.app.data.local

import androidx.room.*
import com.livestock.app.data.model.MonthlyRecord
import kotlinx.coroutines.flow.Flow

@Dao
interface RecordDao {
    @Query("SELECT * FROM monthly_records WHERE isDraft = 0 ORDER BY recordDate DESC")
    fun getAllRecords(): Flow<List<MonthlyRecord>>

    @Query("SELECT * FROM monthly_records WHERE tagNo = :tagNo ORDER BY recordDate DESC")
    fun getRecordsForAnimal(tagNo: String): Flow<List<MonthlyRecord>>

    @Query("SELECT * FROM monthly_records WHERE isDraft = 1 ORDER BY createdAt DESC")
    fun getDrafts(): Flow<List<MonthlyRecord>>

    @Query("SELECT * FROM monthly_records WHERE id = :id LIMIT 1")
    suspend fun getRecordById(id: Long): MonthlyRecord?

    @Query("SELECT COUNT(*) FROM monthly_records WHERE isDraft = 0")
    fun getRecordCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM monthly_records WHERE isDraft = 1")
    fun getDraftCount(): Flow<Int>

    @Query("SELECT AVG(milkPerDay) FROM monthly_records WHERE isDraft = 0")
    fun getAverageMilk(): Flow<Double?>

    @Query("SELECT SUM(expenses) FROM monthly_records WHERE isDraft = 0")
    fun getTotalExpenses(): Flow<Double?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecord(record: MonthlyRecord): Long

    @Update
    suspend fun updateRecord(record: MonthlyRecord)

    @Delete
    suspend fun deleteRecord(record: MonthlyRecord)

    @Query("DELETE FROM monthly_records WHERE id = :id")
    suspend fun deleteRecordById(id: Long)
}
