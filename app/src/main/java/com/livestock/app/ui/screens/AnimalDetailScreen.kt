package com.livestock.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.livestock.app.data.model.MonthlyRecord
import com.livestock.app.ui.theme.Emerald500
import com.livestock.app.ui.theme.Emerald600
import com.livestock.app.ui.theme.Indigo500
import com.livestock.app.ui.viewmodel.LivestockViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnimalDetailScreen(
    tagNo: String,
    viewModel: LivestockViewModel,
    onNavigateBack: () -> Unit,
    onAddRecordForAnimal: (String) -> Unit
) {
    var animal by remember { mutableStateOf<Animal?>(null) }
    val animalRecords by viewModel.getRecordsForAnimal(tagNo).collectAsState(initial = emptyList())

    LaunchedEffect(tagNo) {
        animal = viewModel.getAnimal(tagNo)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Animal Profile", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { onAddRecordForAnimal(tagNo) },
                containerColor = Emerald600,
                contentColor = Color.White
            ) {
                Row(modifier = Modifier.padding(horizontal = 16.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Filled.Add, contentDescription = null)
                    Text("Add Record", fontWeight = FontWeight.Bold)
                }
            }
        }
    ) { padding ->
        val curAnimal = animal
        if (curAnimal == null) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Main Animal Identity Card
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                    Box(
                                        modifier = Modifier
                                            .size(52.dp)
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(Emerald500.copy(alpha = 0.15f)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(if (curAnimal.animalType == "Buffalo") "🐃" else "🐄", fontSize = 28.sp)
                                    }
                                    Column {
                                        Text(curAnimal.tagNo, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                                        Text("${curAnimal.animalType} • ${curAnimal.breed.ifEmpty { "N/A" }}", color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f), fontSize = 13.sp)
                                    }
                                }

                                Surface(shape = RoundedCornerShape(6.dp), color = Emerald500.copy(alpha = 0.15f)) {
                                    Text(
                                        "${curAnimal.bodyWeight} kg",
                                        color = Emerald600,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.08f))

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Column {
                                    Text("Owner Name", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                                    Text(curAnimal.ownerName.ifEmpty { "N/A" }, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                }
                                Column {
                                    Text("Village", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                                    Text(curAnimal.village.ifEmpty { "N/A" }, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text("Mobile", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                                    Text(curAnimal.mobileNo.ifEmpty { "N/A" }, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                }
                            }
                        }
                    }
                }

                // Records Header
                item {
                    Text(
                        "Monthly Production & Health Records (${animalRecords.size})",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                if (animalRecords.isEmpty()) {
                    item {
                        EmptyStateCard(
                            title = "No Records For This Animal",
                            desc = "Tap 'Add Record' below to create a monthly milk and health entry."
                        )
                    }
                } else {
                    items(animalRecords, key = { it.id }) { record ->
                        RecordHistoryCard(record = record, onDelete = { viewModel.deleteRecord(record) })
                    }
                }

                item { Spacer(modifier = Modifier.height(80.dp)) }
            }
        }
    }
}
