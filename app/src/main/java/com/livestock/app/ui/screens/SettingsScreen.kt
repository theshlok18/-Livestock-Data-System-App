package com.livestock.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.livestock.app.ui.theme.Emerald600
import com.livestock.app.ui.theme.Indigo600
import com.livestock.app.ui.theme.Rose500
import com.livestock.app.ui.viewmodel.LivestockViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: LivestockViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    var showImportDialog by remember { mutableStateOf(false) }
    var importJsonText by remember { mutableStateOf("") }

    val animalCount by viewModel.animalCount.collectAsState()
    val recordCount by viewModel.recordCount.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings & Local Storage", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Storage Health Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Local Phone Storage Status", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("All data is stored directly on your phone in SQLite Room Database.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Divider(modifier = Modifier.padding(vertical = 4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Total Registered Animals:", fontSize = 13.sp)
                        Text("$animalCount", fontWeight = FontWeight.Bold, color = Emerald600)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Total Logged Records:", fontSize = 13.sp)
                        Text("$recordCount", fontWeight = FontWeight.Bold, color = Indigo600)
                    }
                }
            }

            Text("Backup & Data Transfer", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

            // Export Button
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Icon(Icons.Filled.Download, contentDescription = null, tint = Emerald600)
                        Column {
                            Text("Export Phone Database (JSON)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Copy full database backup to clipboard or share", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        }
                    }
                    Button(
                        onClick = {
                            viewModel.exportBackup { json ->
                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                val clip = ClipData.newPlainText("Livestock Backup", json)
                                clipboard.setPrimaryClip(clip)
                                Toast.makeText(context, "Backup copied to clipboard! ($json.length bytes)", Toast.LENGTH_LONG).show()
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                    ) {
                        Icon(Icons.Filled.ContentCopy, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Copy Full JSON Backup")
                    }
                }
            }

            // Import Button
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Icon(Icons.Filled.Upload, contentDescription = null, tint = Indigo600)
                        Column {
                            Text("Import Backup to Phone", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Restore animals and monthly logs from JSON backup", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        }
                    }
                    OutlinedButton(
                        onClick = { showImportDialog = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Filled.Input, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Paste & Restore JSON Backup")
                    }
                }
            }

            Text("About App", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text("Livestock Mobile App v1.0.0", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Offline-First Android Architecture with Room Database", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Text("Designed for Field Officers & Farmers", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                }
            }

            Spacer(modifier = Modifier.height(40.dp))
        }

        if (showImportDialog) {
            AlertDialog(
                onDismissRequest = { showImportDialog = false },
                title = { Text("Restore Local Database") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Paste your exported JSON backup below to restore all animals and records into local storage:")
                        OutlinedTextField(
                            value = importJsonText,
                            onValueChange = { importJsonText = it },
                            placeholder = { Text("Paste JSON here...") },
                            modifier = Modifier.fillMaxWidth().height(150.dp),
                            shape = RoundedCornerShape(8.dp)
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (importJsonText.isBlank()) {
                                Toast.makeText(context, "Please paste JSON backup content", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            viewModel.importBackup(importJsonText) { success ->
                                if (success) {
                                    Toast.makeText(context, "Data successfully restored into phone! ✓", Toast.LENGTH_SHORT).show()
                                    showImportDialog = false
                                    importJsonText = ""
                                } else {
                                    Toast.makeText(context, "Invalid JSON format", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    ) {
                        Text("Restore Now")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showImportDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}
