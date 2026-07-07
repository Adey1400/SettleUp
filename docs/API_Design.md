# SettleUp API Design
## Auth Service
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout

## User Service
GET    /api/v1/users/me
PUT    /api/v1/users/me
GET    /api/v1/users/{id}

## Group Service
POST   /api/v1/groups
GET    /api/v1/groups
GET    /api/v1/groups/{id}
PUT    /api/v1/groups/{id}
DELETE /api/v1/groups/{id}

POST   /api/v1/groups/{id}/members
GET    /api/v1/groups/{id}/members
DELETE /api/v1/groups/{id}/members/{userId}

## Expense Service
POST   /api/v1/expenses
GET    /api/v1/expenses/{id}
PUT    /api/v1/expenses/{id}
DELETE /api/v1/expenses/{id}
GET    /api/v1/groups/{id}/expenses

## Balance Service
GET    /api/v1/balances/me
GET    /api/v1/groups/{id}/balances

## Settlement Service
POST   /api/v1/settlements
GET    /api/v1/groups/{id}/settlements

## Notification Service
GET    /api/v1/notifications
PUT    /api/v1/notifications/{id}/read