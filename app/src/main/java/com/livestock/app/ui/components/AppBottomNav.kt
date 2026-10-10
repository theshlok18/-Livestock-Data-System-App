package com.livestock.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector) {
    object Dashboard : Screen("dashboard", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    object Animals : Screen("animals", "Animals", Icons.Filled.Pets, Icons.Outlined.Pets)
    object AddRecord : Screen("add_record", "Record", Icons.Filled.AddCircle, Icons.Outlined.AddCircleOutline)
    object Feeding : Screen("feeding", "Feeding", Icons.Filled.Restaurant, Icons.Outlined.RestaurantMenu)
    object History : Screen("history", "History", Icons.Filled.History, Icons.Outlined.History)
}

@Composable
fun AppBottomNav(
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    val items = listOf(
        Screen.Dashboard,
        Screen.Animals,
        Screen.AddRecord,
        Screen.Feeding,
        Screen.History
    )

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = NavigationBarDefaults.Elevation
    ) {
        items.forEach { screen ->
            val isSelected = currentRoute == screen.route
            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavigate(screen.route) },
                icon = {
                    Icon(
                        imageVector = if (isSelected) screen.selectedIcon else screen.unselectedIcon,
                        contentDescription = screen.title
                    )
                },
                label = { Text(screen.title) },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary
                )
            )
        }
    }
}
