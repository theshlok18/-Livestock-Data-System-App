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
import com.livestock.app.data.model.MonthlyRecord
import com.livestock.app.ui.theme.Amber500
import com.livestock.app.ui.theme.Emerald500
import com.livestock.app.ui.theme.Emerald600
import com.livestock.app.ui.theme.Indigo500
import com.livestock.app.ui.viewmodel.LivestockViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    viewModel: LivestockViewModel,
    onNavigateBack: () -> Unit
) {
    val records by viewModel.allRecords.collectAsState()
    val drafts by viewModel.drafts.collectAsState()
    var selectedTab by remember { mutableStateOf(0) }

    val tabs = listOf("Production History (${records.size})", "Local Drafts (${drafts.size})")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Records History & Logs", fontWeight = FontWeight.Bold) }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = Emerald600
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { Text(title, fontSize = 13.sp, fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal) }
                    )
                }
            }

            val displayList = if (selectedTab == 0) records else drafts

            if (displayList.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    EmptyStateCard(
                        title = if (selectedTab == 0) "No Records Logged Yet" else "No Drafts Saved",
                        desc = "Logged records will appear here automatically with complete milk, health, and expense history."
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(displayList, key = { it.id }) { record ->
                        RecordHistoryCard(record = record, onDelete = { viewModel.deleteRecord(record) })
                    }
                    item { Spacer(modifier = Modifier.height(80.dp)) }
                }
            }
        }
    }
}

@Composable
fun RecordHistoryCard(
    record: MonthlyRecord,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        record.tagNo,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = if (record.healthStatus == "Healthy") Emerald500.copy(alpha = 0.15f) else Amber500.copy(alpha = 0.15f)
                    ) {
                        Text(
                            record.healthStatus,
                            color = if (record.healthStatus == "Healthy") Emerald600 else Amber500,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        record.recordDate,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                        fontSize = 12.sp
                    )
                    IconButton(onClick = onDelete, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Filled.Delete, contentDescription = "Delete", tint = Color.Red.copy(alpha = 0.6f), modifier = Modifier.size(16.dp))
                    }
                }
            }

            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.08f))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Milk / Day", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Text("${record.milkPerDay} L", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
                Column {
                    Text("Fat / SNF", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Text("${record.fat}% / ${record.snf}%", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                }
                Column {
                    Text("Rate", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Text("₹${record.rate}/L", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text("Expenses", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Text("₹${record.expenses}", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Amber500)
                }
            }

            if (record.pregnancyStatus != "Non-Pregnant" || record.vaccination.isNotEmpty() || record.notes.isNotEmpty()) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.04f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(8.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        if (record.pregnancyStatus != "Non-Pregnant") {
                            Text("🍼 Reproduction: ${record.pregnancyStatus} (${record.pregnancyMonth} mo)", fontSize = 11.sp)
                        }
                        if (record.vaccination.isNotEmpty()) {
                            Text("💉 Vaccination: ${record.vaccination}", fontSize = 11.sp)
                        }
                        if (record.notes.isNotEmpty()) {
                            Text("📝 Note: ${record.notes}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                        }
                    }
                }
            }
        }
    }
}
