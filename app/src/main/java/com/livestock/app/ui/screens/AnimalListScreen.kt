package com.livestock.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.livestock.app.data.model.Animal
import com.livestock.app.ui.theme.Emerald500
import com.livestock.app.ui.theme.Emerald600
import com.livestock.app.ui.viewmodel.LivestockViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnimalListScreen(
    viewModel: LivestockViewModel,
    onNavigate: (String) -> Unit,
    onSelectAnimal: (String) -> Unit
) {
    val animals by viewModel.allAnimals.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }

    val filterOptions = listOf("All", "Cow", "Buffalo", "Goat", "Sheep")

    val filteredAnimals = animals.filter { animal ->
        val matchesType = if (selectedFilter == "All") true else animal.animalType.equals(selectedFilter, ignoreCase = true)
        val matchesQuery = if (searchQuery.isBlank()) true else {
            animal.tagNo.contains(searchQuery, ignoreCase = true) ||
            animal.ownerName.contains(searchQuery, ignoreCase = true) ||
            animal.village.contains(searchQuery, ignoreCase = true) ||
            animal.breed.contains(searchQuery, ignoreCase = true)
        }
        matchesType && matchesQuery
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Animal Records (${filteredAnimals.size})",
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(onClick = { onNavigate("add_animal") }) {
                        Icon(Icons.Filled.Add, contentDescription = "Add Animal")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { onNavigate("add_animal") },
                containerColor = Emerald600,
                contentColor = Color.White
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Animal")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search by Tag No, Owner or Village...") },
                leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Filled.Clear, contentDescription = "Clear")
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Emerald600,
                    unfocusedBorderColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.2f)
                )
            )

            // Category Filter Chips
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(filterOptions) { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Emerald600,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            // Animals List
            if (filteredAnimals.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    EmptyStateCard(
                        title = "No Animals Found",
                        desc = if (searchQuery.isNotEmpty()) "Try adjusting your search criteria or filter."
                        else "No animals saved yet. Click '+' to add one."
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredAnimals, key = { it.tagNo }) { animal ->
                        AnimalItemCard(
                            animal = animal,
                            onClick = { onSelectAnimal(animal.tagNo) }
                        )
                    }
                    item { Spacer(modifier = Modifier.height(80.dp)) }
                }
            }
        }
    }
}
