package com.livestock.app

import android.app.Application
import com.livestock.app.data.local.AppDatabase
import com.livestock.app.data.repository.LivestockRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob

class LivestockApplication : Application() {
    private val applicationScope = CoroutineScope(SupervisorJob())

    val database by lazy { AppDatabase.getDatabase(this, applicationScope) }
    val repository by lazy { LivestockRepository(database.animalDao(), database.recordDao()) }
}
