package com.livestock.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.livestock.app.data.model.MonthlyRecord
import com.livestock.app.ui.theme.Amber500
import com.livestock.app.ui.theme.Emerald600
import com.livestock.app.ui.theme.Indigo600
import com.livestock.app.ui.viewmodel.LivestockViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RecordEntryScreen(
    viewModel: LivestockViewModel,
    initialTagNo: String = "",
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val animals by viewModel.allAnimals.collectAsState()

    val todayDate = remember {
        SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    }

    var selectedTag by remember { mutableStateOf(initialTagNo.ifEmpty { animals.firstOrNull()?.tagNo ?: "" }) }
    var recordDate by remember { mutableStateOf(todayDate) }
    var milkPerDay by remember { mutableStateOf("") }
    var fat by remember { mutableStateOf("") }
    var snf by remember { mutableStateOf("") }
    var rate by remember { mutableStateOf("") }
    var expenses by remember { mutableStateOf("") }
    var healthStatus by remember { mutableStateOf("Healthy") }
    var vaccination by remember { mutableStateOf("") }
    var deworming by remember { mutableStateOf("") }
    var pregnancyStatus by remember { mutableStateOf("Non-Pregnant") }
    var pregnancyMonth by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }

    val healthOptions = listOf("Healthy", "Sick", "Under Treatment", "Vaccinated")
    val pregnancyOptions = listOf("Non-Pregnant", "Pregnant", "Inseminated")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Log Monthly Record", fontWeight = FontWeight.Bold) },
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
            Text("Target Animal & Date", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

            OutlinedTextField(
                value = selectedTag,
                onValueChange = { selectedTag = it.uppercase() },
                label = { Text("Tag Number *") },
                placeholder = { Text("Enter or select Tag No") },
                leadingIcon = { Icon(Icons.Filled.Pets, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = recordDate,
                onValueChange = { recordDate = it },
                label = { Text("Record Date (YYYY-MM-DD)") },
                leadingIcon = { Icon(Icons.Filled.CalendarToday, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Divider(modifier = Modifier.padding(vertical = 4.dp))

            Text("Milk & Production Metrics", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = milkPerDay,
                    onValueChange = { milkPerDay = it },
                    label = { Text("Milk (L/Day)") },
                    placeholder = { Text("15.5") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = fat,
                    onValueChange = { fat = it },
                    label = { Text("Fat %") },
                    placeholder = { Text("4.5") },
                    keyboardOptions = KeyboardOptions(KeyboardType.Decimal),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = snf,
                    onValueChange = { snf = it },
                    label = { Text("SNF %") },
                    placeholder = { Text("8.8") },
                    keyboardOptions = KeyboardOptions(KeyboardType.Decimal),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = rate,
                    onValueChange = { rate = it },
                    label = { Text("Rate (₹/L)") },
                    placeholder = { Text("40.0") },
                    keyboardOptions = KeyboardOptions(KeyboardType.Decimal),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            OutlinedTextField(
                value = expenses,
                onValueChange = { expenses = it },
                label = { Text("Daily / Monthly Expenses (₹)") },
                placeholder = { Text("150.00") },
                leadingIcon = { Icon(Icons.Filled.CurrencyRupee, contentDescription = null) },
                keyboardOptions = KeyboardOptions(KeyboardType.Decimal),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Divider(modifier = Modifier.padding(vertical = 4.dp))

            Text("Health & Breeding Status", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

            Text("Health Condition", fontSize = 13.sp)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                healthOptions.forEach { status ->
                    FilterChip(
                        selected = healthStatus == status,
                        onClick = { healthStatus = status },
                        label = { Text(status, fontSize = 12.sp) }
                    )
                }
            }

            Text("Reproduction Status", fontSize = 13.sp)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                pregnancyOptions.forEach { p ->
                    FilterChip(
                        selected = pregnancyStatus == p,
                        onClick = { pregnancyStatus = p },
                        label = { Text(p, fontSize = 12.sp) }
                    )
                }
            }

            if (pregnancyStatus == "Pregnant") {
                OutlinedTextField(
                    value = pregnancyMonth,
                    onValueChange = { pregnancyMonth = it },
                    label = { Text("Pregnancy Month (1-10)") },
                    keyboardOptions = KeyboardOptions(KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            OutlinedTextField(
                value = vaccination,
                onValueChange = { vaccination = it },
                label = { Text("Vaccination Details") },
                placeholder = { Text("e.g. FMD, HS, BQ") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = deworming,
                onValueChange = { deworming = it },
                label = { Text("Deworming Medicine") },
                placeholder = { Text("e.g. Albendazole / Fenbendazole") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = notes,
                onValueChange = { notes = it },
                label = { Text("Field Notes / Observations") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                minLines = 2
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        if (selectedTag.isBlank()) {
                            Toast.makeText(context, "Enter Tag Number", Toast.LENGTH_SHORT).show()
                            return@OutlinedButton
                        }
                        val record = MonthlyRecord(
                            tagNo = selectedTag.trim(),
                            recordDate = recordDate,
                            milkPerDay = milkPerDay.toDoubleOrNull() ?: 0.0,
                            fat = fat.toDoubleOrNull() ?: 0.0,
                            snf = snf.toDoubleOrNull() ?: 0.0,
                            rate = rate.toDoubleOrNull() ?: 0.0,
                            expenses = expenses.toDoubleOrNull() ?: 0.0,
                            healthStatus = healthStatus,
                            pregnancyStatus = pregnancyStatus,
                            pregnancyMonth = pregnancyMonth.toIntOrNull() ?: 0,
                            vaccination = vaccination,
                            deworming = deworming,
                            notes = notes,
                            isDraft = true
                        )
                        viewModel.saveRecord(record) {
                            Toast.makeText(context, "Saved as Draft locally 📝", Toast.LENGTH_SHORT).show()
                            onNavigateBack()
                        }
                    },
                    modifier = Modifier.weight(1f).height(50.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Save Draft")
                }

                Button(
                    onClick = {
                        if (selectedTag.isBlank()) {
                            Toast.makeText(context, "Enter Tag Number", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        val record = MonthlyRecord(
                            tagNo = selectedTag.trim(),
                            recordDate = recordDate,
                            milkPerDay = milkPerDay.toDoubleOrNull() ?: 0.0,
                            fat = fat.toDoubleOrNull() ?: 0.0,
                            snf = snf.toDoubleOrNull() ?: 0.0,
                            rate = rate.toDoubleOrNull() ?: 0.0,
                            expenses = expenses.toDoubleOrNull() ?: 0.0,
                            healthStatus = healthStatus,
                            pregnancyStatus = pregnancyStatus,
                            pregnancyMonth = pregnancyMonth.toIntOrNull() ?: 0,
                            vaccination = vaccination,
                            deworming = deworming,
                            notes = notes,
                            isDraft = false
                        )
                        viewModel.saveRecord(record) {
                            Toast.makeText(context, "Record Saved to Phone Storage! ✓", Toast.LENGTH_SHORT).show()
                            onNavigateBack()
                        }
                    },
                    modifier = Modifier.weight(1f).height(50.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text("Submit Record", fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
