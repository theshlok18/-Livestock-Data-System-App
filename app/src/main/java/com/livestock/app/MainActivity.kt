package com.livestock.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.livestock.app.ui.components.AppBottomNav
import com.livestock.app.ui.components.Screen
import com.livestock.app.ui.screens.*
import com.livestock.app.ui.theme.LivestockAppTheme
import com.livestock.app.ui.viewmodel.LivestockViewModel
import com.livestock.app.ui.viewmodel.LivestockViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: LivestockViewModel by viewModels {
        LivestockViewModelFactory((application as LivestockApplication).repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LivestockAppTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Dashboard.route

                val showBottomNav = currentRoute in listOf(
                    Screen.Dashboard.route,
                    Screen.Animals.route,
                    Screen.AddRecord.route,
                    Screen.Feeding.route,
                    Screen.History.route
                )

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        if (showBottomNav) {
                            AppBottomNav(
                                currentRoute = currentRoute,
                                onNavigate = { route ->
                                    navController.navigate(route) {
                                        popUpTo(navController.graph.startDestinationId) {
                                            saveState = true
                                        }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            )
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Dashboard.route,
                        modifier = Modifier.padding(bottom = if (showBottomNav) innerPadding.calculateBottomPadding() else innerPadding.calculateTopPadding())
                    ) {
                        composable(Screen.Dashboard.route) {
                            DashboardScreen(
                                viewModel = viewModel,
                                onNavigate = { route -> navController.navigate(route) },
                                onSelectAnimal = { tag -> navController.navigate("animal_detail/$tag") }
                            )
                        }
                        composable(Screen.Animals.route) {
                            AnimalListScreen(
                                viewModel = viewModel,
                                onNavigate = { route -> navController.navigate(route) },
                                onSelectAnimal = { tag -> navController.navigate("animal_detail/$tag") }
                            )
                        }
                        composable(Screen.AddRecord.route) {
                            RecordEntryScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                        composable(Screen.Feeding.route) {
                            FeedingScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                        composable(Screen.History.route) {
                            HistoryScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                        composable("add_animal") {
                            AddAnimalScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                        composable("settings") {
                            SettingsScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                        composable("search") {
                            AnimalListScreen(
                                viewModel = viewModel,
                                onNavigate = { route -> navController.navigate(route) },
                                onSelectAnimal = { tag -> navController.navigate("animal_detail/$tag") }
                            )
                        }
                        composable(
                            route = "animal_detail/{tagNo}",
                            arguments = listOf(navArgument("tagNo") { type = NavType.StringType })
                        ) { backStackEntry ->
                            val tagNo = backStackEntry.arguments?.getString("tagNo") ?: ""
                            AnimalDetailScreen(
                                tagNo = tagNo,
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() },
                                onAddRecordForAnimal = { tag -> navController.navigate("record_for/$tag") }
                            )
                        }
                        composable(
                            route = "record_for/{tagNo}",
                            arguments = listOf(navArgument("tagNo") { type = NavType.StringType })
                        ) { backStackEntry ->
                            val tagNo = backStackEntry.arguments?.getString("tagNo") ?: ""
                            RecordEntryScreen(
                                viewModel = viewModel,
                                initialTagNo = tagNo,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}
