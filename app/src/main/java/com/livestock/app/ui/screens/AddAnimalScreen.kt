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
import com.livestock.app.data.model.Animal
import com.livestock.app.ui.theme.Emerald600
import com.livestock.app.ui.viewmodel.LivestockViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddAnimalScreen(
    viewModel: LivestockViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current

    var tagNo by remember { mutableStateOf("") }
    var animalType by remember { mutableStateOf("Cow") }
    var breed by remember { mutableStateOf("") }
    var age by remember { mutableStateOf("") }
    var bodyWeight by remember { mutableStateOf("") }
    var ownerName by remember { mutableStateOf("") }
    var village by remember { mutableStateOf("Arjunwada") }
    var contact by remember { mutableStateOf("") }
    var mobileNo by remember { mutableStateOf("") }
    var aadharNo by remember { mutableStateOf("") }

    val animalTypes = listOf("Cow", "Buffalo", "Goat", "Sheep")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Register Animal", fontWeight = FontWeight.Bold) },
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
            Text(
                "Animal Identification",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleMedium
            )

            OutlinedTextField(
                value = tagNo,
                onValueChange = { tagNo = it.uppercase() },
                label = { Text("Tag Number *") },
                placeholder = { Text("e.g. TAG-2001") },
                leadingIcon = { Icon(Icons.Filled.QrCode, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                singleLine = true
            )

            // Animal Type Selector
            Text("Animal Species", fontSize = 13.sp, fontWeight = FontWeight.Medium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                animalTypes.forEach { type ->
                    FilterChip(
                        selected = animalType == type,
                        onClick = { animalType = type },
                        label = { Text(type) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Emerald600,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            OutlinedTextField(
                value = breed,
                onValueChange = { breed = it },
                label = { Text("Breed") },
                placeholder = { Text("e.g. Gir, Murrah, HF Cross") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = age,
                    onValueChange = { age = it },
                    label = { Text("Age") },
                    placeholder = { Text("e.g. 3 Yrs 4 Mos") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = bodyWeight,
                    onValueChange = { bodyWeight = it },
                    label = { Text("Weight (kg)") },
                    placeholder = { Text("e.g. 450") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            Divider(modifier = Modifier.padding(vertical = 6.dp))

            Text(
                "Owner & Location Details",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleMedium
            )

            OutlinedTextField(
                value = ownerName,
                onValueChange = { ownerName = it },
                label = { Text("Farmer / Owner Name *") },
                leadingIcon = { Icon(Icons.Filled.Person, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = village,
                onValueChange = { village = it },
                label = { Text("Village / Location") },
                leadingIcon = { Icon(Icons.Filled.LocationOn, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = mobileNo,
                    onValueChange = { mobileNo = it },
                    label = { Text("Mobile Number") },
                    leadingIcon = { Icon(Icons.Filled.Phone, contentDescription = null) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = aadharNo,
                    onValueChange = { aadharNo = it },
                    label = { Text("Aadhaar No.") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Button(
                onClick = {
                    if (tagNo.isBlank()) {
                        Toast.makeText(context, "Please enter a valid Tag Number", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    val animal = Animal(
                        tagNo = tagNo.trim(),
                        animalType = animalType,
                        breed = breed.trim(),
                        age = age.trim(),
                        bodyWeight = bodyWeight.toDoubleOrNull() ?: 0.0,
                        ownerName = ownerName.trim(),
                        village = village.trim(),
                        contact = mobileNo.trim(),
                        mobileNo = mobileNo.trim(),
                        aadharNo = aadharNo.trim()
                    )
                    viewModel.saveAnimal(animal) {
                        Toast.makeText(context, "Animal ${animal.tagNo} saved to phone storage! ✓", Toast.LENGTH_SHORT).show()
                        onNavigateBack()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
            ) {
                Icon(Icons.Filled.Save, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save to Phone Storage", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
