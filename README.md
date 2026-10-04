SettleUp: Shared Finances, Simplified.
SettleUp is a robust, microservices-based full-stack application designed to take the friction out of shared expenses. Whether you are splitting rent with roommates, organizing a group trip, or sharing dinner bills, SettleUp tracks every penny and calculates the most efficient way for everyone to get paid back.

Built with a scalable Spring Boot backend and a responsive React frontend, SettleUp utilizes an intelligent debt simplification algorithm to minimize total transactions and Redis caching to ensure lightning-fast dashboard performance.

🚀 Key Features
Smart Debt Simplification: An optimized backend algorithm mathematically reduces the total number of payments required for a group to settle up, ensuring nobody is passing the same $20 bill back and forth.

Flexible Splitting Engine: Support for complex real-world scenarios. Split expenses Equally, by Exact Amounts, or by custom Percentages.

Group Management & Invites: Create dedicated groups for different events, invite users via email, and seamlessly manage pending group invitations.

Instant Ledger & Settlements: View chronological group ledgers and mark individual debts as "Paid" to instantly recalculate and update the group's net balances.

High-Performance Architecture: Utilizes a distributed Redis cache architecture with a Read-Aside strategy and automated cross-service cache eviction to deliver complex financial calculations in milliseconds.

Secure by Design: Protected by stateless JWT authentication, routed securely through a Spring Cloud API Gateway.

🛠️ Tech Stack
Frontend

Framework: React (Vite)

Styling: Tailwind CSS

Animations: Framer Motion

Icons & UI: Lucide React, React Toastify

Routing & HTTP: React Router DOM, Axios

Backend (Microservices Architecture)

Framework: Java 17, Spring Boot 3.5

Services: User Service, Group Service, Expense Service, Balance Service

Infrastructure: Spring Cloud Gateway, Netflix Eureka (Discovery Server)

Security: Spring Security, JSON Web Tokens (JWT)

Inter-Service Communication: Spring Cloud OpenFeign

Databases & Caching

Primary Database: PostgreSQL (Spring Data JPA / Hibernate)

Distributed Cache: Redis (Spring Boot Starter Data Redis)
