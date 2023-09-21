import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { combineLatest } from 'rxjs';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { AdminGuard } from './service/admin.guard';
import { UserGuard } from './service/user.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewCategoriesComponent } from './pages/admin/view-categories/view-categories.component';
import { AddCategoryComponent } from './pages/admin/add-category/add-category.component';
import { ViewQuizzesComponent } from './pages/admin/view-quizzes/view-quizzes.component';
import { AddQuizComponent } from './pages/admin/add-quiz/add-quiz.component';
import { UpdateQuizComponent } from './pages/admin/update-quiz/update-quiz.component';
import { ViewQuestionsComponent } from './pages/admin/view-questions/view-questions.component';
import { AddQuestionComponent } from './pages/admin/add-question/add-question.component';
import { UpdateQuestionComponent } from './pages/admin/update-question/update-question.component';
import { UpdateCategoryComponent } from './pages/admin/update-category/update-category.component';
import { UserViewCategoriesComponent } from './pages/user/user-view-categories/user-view-categories.component';
import { UserViewQuizzesComponent } from './pages/user/user-view-quizzes/user-view-quizzes.component';
import { UserInstructionsComponent } from './pages/user/user-instructions/user-instructions.component';
import { StartQuizComponent } from './pages/start-quiz/start-quiz.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'categories',
        component: ViewCategoriesComponent,
      },
      {
        path: 'add-category',
        component: AddCategoryComponent,
      },
      {
        path: 'category/:cID',
        component: UpdateCategoryComponent,
      },
      {
        path: 'quizzes/:cID/:cName',
        component: ViewQuizzesComponent,
      },
      {
        path: 'add-quiz',
        component: AddQuizComponent,
      },
      {
        path: 'quiz/:qID',
        component: UpdateQuizComponent,
      },
      {
        path: 'view-questions/:qID/:qName',
        component: ViewQuestionsComponent,
      },
      {
        path: 'add-question/:qID/:qName',
        component: AddQuestionComponent,
      },
      {
        path: 'question/:quesID',
        component: UpdateQuestionComponent,
      },
    ],
    canActivate: [AdminGuard],
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'categories',
        component: UserViewCategoriesComponent,
      },
      {
        path: 'quizzes/:cID/:cName',
        component: UserViewQuizzesComponent,
      },
      {
        path: 'instructions/:qID/:qName',
        component: UserInstructionsComponent,
      },
    ],
    canActivate: [UserGuard],
  },
  {
    path: 'start-quiz/:qID/:qName',
    component: StartQuizComponent,
    canActivate: [UserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
