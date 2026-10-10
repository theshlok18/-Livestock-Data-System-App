package com.livestock.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.livestock.app.data.model.Animal
import com.livestock.app.data.model.MonthlyRecord
import com.livestock.app.data.repository.LivestockRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class LivestockViewModel(private val repository: LivestockRepository) : ViewModel() {

    val allAnimals: StateFlow<List<Animal>> = repository.allAnimals
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allRecords: StateFlow<List<MonthlyRecord>> = repository.allRecords
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val drafts: StateFlow<List<MonthlyRecord>> = repository.drafts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val animalCount: StateFlow<Int> = repository.animalCount
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val recordCount: StateFlow<Int> = repository.recordCount
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val draftCount: StateFlow<Int> = repository.draftCount
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val averageMilk: StateFlow<Double?> = repository.averageMilk
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val totalExpenses: StateFlow<Double?> = repository.totalExpenses
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    val searchResults: StateFlow<List<Animal>> = _searchQuery
        .debounce(300)
        .flatMapLatest { query ->
            if (query.isBlank()) repository.allAnimals
            else repository.searchAnimals(query)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun getRecordsForAnimal(tagNo: String): Flow<List<MonthlyRecord>> {
        return repository.getRecordsForAnimal(tagNo)
    }

    suspend fun getAnimal(tagNo: String): Animal? {
        return repository.getAnimalByTag(tagNo)
    }

    fun saveAnimal(animal: Animal, onComplete: () -> Unit = {}) {
        viewModelScope.launch {
            repository.insertAnimal(animal)
            onComplete()
        }
    }

    fun deleteAnimal(animal: Animal) {
        viewModelScope.launch {
            repository.deleteAnimal(animal)
        }
    }

    fun saveRecord(record: MonthlyRecord, onComplete: () -> Unit = {}) {
        viewModelScope.launch {
            repository.insertRecord(record)
            onComplete()
        }
    }

    fun deleteRecord(record: MonthlyRecord) {
        viewModelScope.launch {
            repository.deleteRecord(record)
        }
    }

    fun exportBackup(onExported: (String) -> Unit) {
        viewModelScope.launch {
            val animals = allAnimals.value
            val records = allRecords.value
            val json = repository.exportBackupJson(animals, records)
            onExported(json)
        }
    }

    fun importBackup(json: String, onResult: (Boolean) -> Unit) {
        viewModelScope.launch {
            val success = repository.importBackupJson(json)
            onResult(success)
        }
    }
}

class LivestockViewModelFactory(private val repository: LivestockRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(LivestockViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return LivestockViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
