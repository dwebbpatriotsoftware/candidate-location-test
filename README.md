# Candidate Location Assessment Tool

## Eligibility Determination Workflow


| | VPN | !VPN && IP not US | !VPN && IP is US |
|------------------|-----|-------------------|------------------|
| Time Zone != US | <span style="color:red">Exit</span> | <span style="color:red">Exit</span> | <span style="color:orange">Caution</span> |
| Time Zone == US | <span style="color:orange">Caution</span> | <span style="color:orange">Caution</span> | <span style="color:green">Proceed</span> |

### Decision Flow Diagram

The following diagram illustrates the logical decision process for determining candidate eligibility based on their location data:

```mermaid
flowchart TD
    A[Start: Review Candidate Data] --> B[Check Candidate Timezone]
    B --> C{Is Timezone US?}
    C -->|Yes| D[Check IP Address]
    C -->|No| E[Check IP Address]
    
    D --> F{Is IP from VPN?}
    E --> G{Is IP from VPN?}
    
    F -->|Yes| H[Caution]
    F -->|No| I{Is IP from US?}
    G -->|Yes| J[Exit]
    G -->|No| K{Is IP from US?}
    
    I -->|Yes| L[Proceed]
    I -->|No| M[Caution]
    K -->|Yes| N[Caution]
    K -->|No| O[Exit]
    
    H --> P[Final Decision]
    J --> P
    L --> P
    M --> P
    N --> P
    O --> P
    
    P --> Q[End]
    
    classDef green fill:#d4edda,stroke:#28a745,color:#155724;
    classDef yellow fill:#fff3cd,stroke:#ffc107,color:#856404;
    classDef red fill:#f8d7da,stroke:#dc3545,color:#721c24;
    
    class L green;
    class H,M,N yellow;
    class J,O red;
```

### Administrator Review Process

This diagram shows the steps an administrator takes when reviewing candidate data:

```mermaid
flowchart TD
    A[Administrator] --> B[Login to Reports Page]
    B --> C[View candidate data in table]
    C --> D{Check timezone}
    D -->|Approved timezone| E[Green background]
    D -->|Non-approved timezone| F[Red background]
    
    C --> G[Check IP address]
    G --> H[Click IP to open IP Quality Score]
    H --> I[Review IP risk factors]
    
    C --> J[Review candidate answers]
    
    E --> K{Determine eligibility}
    F --> K
    I --> K
    J --> K
    
    K -->|Eligible| L[Proceed with candidate]
    K -->|Not eligible| M[Reject candidate]
    
    L --> N[Delete record if no longer needed]
    M --> N
```

### Complete Eligibility Workflow

This diagram provides a comprehensive view of the entire eligibility determination process:

```mermaid
flowchart TD
    A[Start] --> B[Administrator logs in]
    B --> C[Generate candidate assessment URL]
    C --> D[Send URL to candidate]
    D --> E[Candidate opens URL]
    E --> F[System captures IP and timezone]
    F --> G[Candidate completes assessment]
    G --> H[Data appears in reports page]
    H --> I[Administrator reviews data]
    I --> J{Determine eligibility}
    J -->|Eligible| K[Proceed with candidate]
    J -->|Not eligible| L[Reject candidate]
    K --> M[End]
    L --> M
```


# Current Limitations

## Extra Candidate IDs
Unfamiliar Candidate IDs in the report may result from anyone manipulating the URL query string to add data with any candidateId value to the table. Increased frequency may indicate intentional tampering, necessitating security measures to restrict table access.

## Time Zone List
The list of time zones included here may not be exhaustive for the continental US. Verify if any US time zones are incorrectly marked red, indicating they are outside the US. If any are found, update the list to include the new time zone.

The list includes time zones in states where we currently hire and states where we do not. For example, we don't hire in California, but the America/Los_Angeles time zone is on the list because some areas in Oregon may also use it. Similarly, most areas on the East Coast use the New_York time zone.

# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
