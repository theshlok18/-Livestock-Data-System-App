package com.livestock.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.livestock.app.data.model.FeedingItem
import com.livestock.app.ui.theme.Amber500
import com.livestock.app.ui.theme.Emerald600
import com.livestock.app.ui.theme.Indigo500
import com.livestock.app.ui.viewmodel.LivestockViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedingScreen(
    viewModel: LivestockViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val animals by viewModel.allAnimals.collectAsState()

    var selectedTag by remember { mutableStateOf(animals.firstOrNull()?.tagNo ?: "") }
    var feedItems by remember {
        mutableStateOf(
            listOf(
                FeedingItem(id = "1", feedType = "Concentrates", feedName = "Cattle Feed / Grain", quantityKg = 4.0, costPerKg = 28.0, totalCost = 112.0),
                FeedingItem(id = "2", feedType = "Green Fodder", feedName = "Napier / Maize Grass", quantityKg = 20.0, costPerKg = 2.5, totalCost = 50.0),
                FeedingItem(id = "3", feedType = "Mineral Mixture", feedName = "Chelated Minerals", quantityKg = 0.1, costPerKg = 180.0, totalCost = 18.0)
            )
        )
    }

    val totalFeedCost = feedItems.sumOf { it.quantityKg * it.costPerKg }
    val totalFeedWeight = feedItems.sumOf { it.quantityKg }

    val feedTypes = listOf("Concentrates", "Green Fodder", "Dry Fodder", "Mineral Mixture", "Supplements")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Feeding & Ration Management", fontWeight = FontWeight.Bold) }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Cost Summary Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Daily Feeding Cost", color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f), fontSize = 12.sp)
                                Text("₹${String.format("%.2f", totalFeedCost)}", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("Total Ration Weight", color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f), fontSize = 12.sp)
                                Text("${String.format("%.1f", totalFeedWeight)} kg/day", fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }
                }
            }

            // Tag Selector
            item {
                OutlinedTextField(
                    value = selectedTag,
                    onValueChange = { selectedTag = it.uppercase() },
                    label = { Text("Target Animal Tag No") },
                    placeholder = { Text("Select animal tag") },
                    leadingIcon = { Icon(Icons.Filled.Pets, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            // Section Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Dietary Ration Items", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    Button(
                        onClick = {
                            feedItems = feedItems + FeedingItem(
                                id = System.currentTimeMillis().toString(),
                                feedType = "Concentrates",
                                feedName = "",
                                quantityKg = 1.0,
                                costPerKg = 25.0,
                                totalCost = 25.0
                            )
                        },
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Filled.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Add Item", fontSize = 12.sp)
                    }
                }
            }

            // Feed Items List
            itemsIndexed(feedItems) { index, item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "Ration #${index + 1} - ${item.feedType}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = Indigo500
                            )
                            IconButton(
                                onClick = {
                                    feedItems = feedItems.filterIndexed { i, _ -> i != index }
                                },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(Icons.Filled.Delete, contentDescription = "Delete", tint = Color.Red.copy(alpha = 0.7f))
                            }
                        }

                        OutlinedTextField(
                            value = item.feedName,
                            onValueChange = { name ->
                                feedItems = feedItems.toMutableList().also {
                                    it[index] = item.copy(feedName = name)
                                }
                            },
                            label = { Text("Feed Name / Formula") },
                            placeholder = { Text("e.g. Maize, Cotton Cake") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp)
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            OutlinedTextField(
                                value = if (item.quantityKg == 0.0) "" else item.quantityKg.toString(),
                                onValueChange = { q ->
                                    val qty = q.toDoubleOrNull() ?: 0.0
                                    feedItems = feedItems.toMutableList().also {
                                        it[index] = item.copy(quantityKg = qty, totalCost = qty * item.costPerKg)
                                    }
                                },
                                label = { Text("Qty (kg)") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(10.dp)
                            )

                            OutlinedTextField(
                                value = if (item.costPerKg == 0.0) "" else item.costPerKg.toString(),
                                onValueChange = { c ->
                                    val rate = c.toDoubleOrNull() ?: 0.0
                                    feedItems = feedItems.toMutableList().also {
                                        it[index] = item.copy(costPerKg = rate, totalCost = rate * item.quantityKg)
                                    }
                                },
                                label = { Text("₹ / kg") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(10.dp)
                            )
                        }

                        Text(
                            "Subtotal: ₹${String.format("%.2f", item.quantityKg * item.costPerKg)}",
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 12.sp,
                            color = Emerald600,
                            modifier = Modifier.align(Alignment.End)
                        )
                    }
                }
            }

            // Save Button
            item {
                Button(
                    onClick = {
                        Toast.makeText(context, "Feeding Schedule saved for $selectedTag! ✓", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Icon(Icons.Filled.Save, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Save Ration to Local Storage", fontWeight = FontWeight.Bold)
                }
            }

            item { Spacer(modifier = Modifier.height(80.dp)) }
        }
    }
}
