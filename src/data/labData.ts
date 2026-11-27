export interface VmInstance {
  id: string;
  instanceId: string;
  name: string;
  zone: string;
  machineType: string;
  internalIp: string;
  externalIp: string;
  status: 'Running';
  baselineCpuUsage: number;
  baselineCpuUtilization: number;
  color: string;
  seriesUtilization: number[];
  seriesUsage: number[];
}

export interface LabScreenshot {
  src: string;
  title: string;
  caption: string;
  timestamp: string;
}

export interface LabConfigRow {
  property: string;
  value: string;
}

export interface LabTask {
  id: number;
  number: string;
  title: string;
  summary: string;
  firstPersonNote: string;
  steps: string[];
  configTable?: LabConfigRow[];
  screenshots: LabScreenshot[];
}

export interface KnowledgeQuestion {
  id: string;
  taskRef: string;
  question: string;
  multiSelect: boolean;
  options: {
    id: string;
    label: string;
    correct: boolean;
  }[];
  explanation: string;
}

export const AUTHOR_PROFILE = {
  name: 'Muhammed Abdulazeez',
  email: 'muhammedabdulazeez770@gmail.com',
  alertChannelEmail: 'muhammedabdulazeez8011@gmail.com',
  alertChannelName: 'Tester',
  projectId: 'qwiklabs-gcp-02-8b757eb619d7',
  labTitle: 'Monitor Resources with Google Cloud Observability',
  completedDate: 'November 27, 2026',
  regionZone: 'us-west1-a',
  uptimeCheckId: 'my-uptime-check-fhwa29CMPYM',
};

export const TIME_LABELS = [
  '12:18 PM',
  '12:22 PM',
  '12:26 PM',
  '12:30 PM',
  '12:35 PM',
  '12:40 PM',
  '12:45 PM',
  '12:50 PM',
  '12:55 PM',
  '1:00 PM',
  '1:05 PM',
  '1:10 PM',
];

export const VM_INSTANCES: VmInstance[] = [
  {
    id: 'nginxstack-1',
    instanceId: '7504423117547427995',
    name: 'nginxstack-1',
    zone: 'us-west1-a',
    machineType: 'e2-micro',
    internalIp: '10.138.0.4',
    externalIp: '136.66.120.74',
    status: 'Running',
    baselineCpuUsage: 0.005,
    baselineCpuUtilization: 1.962,
    color: '#9333EA',
    seriesUtilization: [84.2, 2.4, 2.1, 4.3, 1.8, 2.0, 2.2, 1.9, 2.1, 1.95, 2.04, 1.962],
    seriesUsage: [0.42, 0.012, 0.009, 0.018, 0.006, 0.006, 0.007, 0.005, 0.006, 0.005, 0.005, 0.005],
  },
  {
    id: 'nginxstack-2',
    instanceId: '151205598013479067',
    name: 'nginxstack-2',
    zone: 'us-west1-a',
    machineType: 'e2-micro',
    internalIp: '10.138.0.2',
    externalIp: '136.86.196.149',
    status: 'Running',
    baselineCpuUsage: 0.005,
    baselineCpuUtilization: 2.174,
    color: '#2563EB',
    seriesUtilization: [151.0, 2.8, 2.2, 4.9, 2.0, 2.1, 2.3, 2.1, 2.2, 2.1, 2.25, 2.174],
    seriesUsage: [0.76, 0.014, 0.010, 0.021, 0.006, 0.005, 0.006, 0.005, 0.005, 0.005, 0.005, 0.005],
  },
  {
    id: 'nginxstack-3',
    instanceId: '3364177431360755866',
    name: 'nginxstack-3',
    zone: 'us-west1-a',
    machineType: 'e2-micro',
    internalIp: '10.138.0.3',
    externalIp: '35.247.56.3',
    status: 'Running',
    baselineCpuUsage: 0.021,
    baselineCpuUtilization: 12.032,
    color: '#16A34A',
    seriesUtilization: [48.5, 2.1, 2.0, 3.2, 1.9, 2.2, 2.4, 2.8, 14.2, 13.5, 12.6, 12.032],
    seriesUsage: [0.24, 0.009, 0.008, 0.015, 0.006, 0.007, 0.008, 0.011, 0.030, 0.026, 0.023, 0.021],
  },
];

export const LAB_TASKS: LabTask[] = [
  {
    id: 1,
    number: '01',
    title: 'Verify Compute Engine Resources',
    summary: 'Confirmed all three pre-provisioned NGINX VM instances were healthy in us-west1-a.',
    firstPersonNote:
      'Before writing any monitoring rules, I verified the compute footprint in project qwiklabs-gcp-02-8b757eb619d7. Navigating to Compute Engine > VM instances confirmed nginxstack-1, nginxstack-2, and nginxstack-3 were running in us-west1-a with internal VPC addresses in 10.138.0.0/20 and external IPs ready for HTTP probing.',
    steps: [
      'Opened the Google Cloud console Navigation menu and selected Compute Engine > VM instances.',
      'Verified running status checks (green) for nginxstack-1, nginxstack-2, and nginxstack-3.',
      'Recorded internal and external IPv4 addresses in us-west1-a for downstream uptime validation.',
    ],
    configTable: [
      { property: 'Project ID', value: 'qwiklabs-gcp-02-8b757eb619d7' },
      { property: 'Instances', value: 'nginxstack-1, nginxstack-2, nginxstack-3' },
      { property: 'Zone / Machine', value: 'us-west1-a (e2-micro)' },
    ],
    screenshots: [
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_12-55-59_5a39feac.png',
        title: 'Compute Engine VM Instances',
        caption: 'All three NGINX stack nodes running in us-west1-a with internal and external IPs.',
        timestamp: '12:55 PM',
      },
    ],
  },
  {
    id: 2,
    number: '02',
    title: 'Create Custom Dashboards & Explore Metrics',
    summary: 'Built My Dashboard with a Line widget (My Chart) tracking VM Instance CPU utilization.',
    firstPersonNote:
      'Inside Observability > Monitoring > Dashboards, I created a custom dashboard titled My Dashboard and added a Line chart called My Chart bound to compute.googleapis.com/instance/cpu/utilization. You can clearly see the initial startup burst followed by steady-state utilization below 15%. I then reproduced the query in Metrics Explorer for ad-hoc inspection.',
    steps: [
      'Navigated to Monitoring > Dashboards and clicked Create Custom Dashboard.',
      'Renamed the dashboard to My Dashboard and selected Add widget > Line.',
      'Named the widget My Chart and bound the metric VM Instance > Instance > CPU utilization.',
      'Applied the widget to My Dashboard and cross-checked the same time series in Metrics Explorer.',
    ],
    configTable: [
      { property: 'Dashboard Name', value: 'My Dashboard' },
      { property: 'Widget Type & Title', value: 'Line chart — My Chart' },
      { property: 'Metric', value: 'compute.googleapis.com/instance/cpu/utilization' },
      { property: 'Aggregation', value: 'Unaggregated / Time series per instance' },
    ],
    screenshots: [
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_12-57-15_0a34f8c2.png',
        title: 'Monitoring Dashboards Home',
        caption: 'Creating a new custom dashboard inside Google Cloud Observability.',
        timestamp: '12:57 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_12-58-26_ad429a66.png',
        title: 'Add Visualization Widget',
        caption: 'Selecting Line chart from the Visualization catalog inside My Dashboard.',
        timestamp: '12:58 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-00-44_3cf616a8.png',
        title: 'Configure My Chart',
        caption: 'Charting VM Instance - CPU utilization across nginxstack-1, nginxstack-2, and nginxstack-3.',
        timestamp: '1:00 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-08-31_a15a4143.png',
        title: 'Saved Custom Dashboard',
        caption: 'My Dashboard saved with My Chart rendering live autosaved time series.',
        timestamp: '1:08 PM',
      },
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'Create Multi-Condition Alerting Policies',
    summary: 'Configured My Alert Policy requiring both CPU usage and CPU utilization above 20, routed to email.',
    firstPersonNote:
      'Single-metric alerts often fire prematurely on transient spikes. I built My Alert Policy with two threshold conditions—CPU usage above 20 and CPU utilization above 20% over a 1-minute rolling window—and set the multi-condition trigger to "All conditions are met". I also registered my personal email channel (Tester) so notifications land directly in my inbox.',
    steps: [
      'Opened Alerting > + Create policy and selected VM Instance > Instance > CPU usage (1 min rolling window, Above threshold 20).',
      'Added a second condition for VM Instance > Instance > CPU utilization (1 min rolling window, Above threshold 20%).',
      'Set Multi-condition trigger to All conditions are met so the same VM must breach both signals.',
      'Opened Manage Notification Channels, added an Email channel (Tester -> muhammedabdulazeez8011@gmail.com), refreshed, and attached it.',
      'Named the policy My Alert Policy, reviewed both condition charts, and saved the policy.',
    ],
    configTable: [
      { property: 'Alert Policy Name', value: 'My Alert Policy' },
      { property: 'Condition 1', value: 'CPU usage > 20 (1 min mean rolling window)' },
      { property: 'Condition 2', value: 'CPU utilization > 20% (1 min mean rolling window)' },
      { property: 'Combine Rule', value: 'All conditions are met (same resource)' },
      { property: 'Notification Channel', value: 'Tester (Email: muhammedabdulazeez8011@gmail.com)' },
    ],
    screenshots: [
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-09-24_15f2759c.png',
        title: 'Select Metric — CPU Usage',
        caption: 'Filtering VM Instance > Instance metrics to select CPU usage.',
        timestamp: '1:09 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-10-19_1db88233.png',
        title: 'Condition 1 Threshold',
        caption: 'Configuring Above threshold 20 on VM Instance - CPU usage.',
        timestamp: '1:10 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-11-40_a8635e6b.png',
        title: 'Condition 2 Threshold',
        caption: 'Configuring Above threshold 20% on VM Instance - CPU utilization.',
        timestamp: '1:11 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-11-52_3760c32e.png',
        title: 'Multi-Condition Trigger',
        caption: 'Enforcing "All conditions are met" to prevent noisy partial triggers.',
        timestamp: '1:11 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-13-38_536542a8.png',
        title: 'Create Email Notification Channel',
        caption: 'Registering muhammedabdulazeez8011@gmail.com under display name Tester.',
        timestamp: '1:13 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-14-17_d884a510.png',
        title: 'Attach Channel to Policy',
        caption: 'Selecting Tester in the Notification Channels dropdown.',
        timestamp: '1:14 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-15-06_99a777b8.png',
        title: 'Review Alert Policy',
        caption: 'Final verification of My Alert Policy conditions and Tester channel.',
        timestamp: '1:15 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-15-35_577edcc4.png',
        title: 'Policy Saved & Enabled',
        caption: 'My Alert Policy active and monitoring all three nginxstack instances.',
        timestamp: '1:15 PM',
      },
    ],
  },
  {
    id: 4,
    number: '04',
    title: 'Create Dynamic Resource Groups',
    summary: 'Grouped the three NGINX nodes automatically under VM instances using Name Contains nginx.',
    firstPersonNote:
      'Hardcoding instance IDs breaks whenever infrastructure scales. By creating the VM instances resource group with the criterion Name Contains nginx, Cloud Monitoring automatically discovered nginxstack-1, nginxstack-2, and nginxstack-3 along with their attached disks and surfaced a unified group dashboard.',
    steps: [
      'Selected Groups > + Create Group in the Monitoring navigation pane.',
      'Set the group Name to VM instances.',
      'Defined the criterion Type: Name, Operator: Contains, Value: nginx.',
      'Clicked Done and Create, then reviewed the auto-generated group dashboard.',
    ],
    configTable: [
      { property: 'Group Name', value: 'VM instances' },
      { property: 'Criterion Type', value: 'Name' },
      { property: 'Operator & Value', value: 'Contains "nginx"' },
      { property: 'Matched Resources', value: 'nginxstack-1, nginxstack-2, nginxstack-3' },
    ],
    screenshots: [
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-16-32_bf9f357d.png',
        title: 'Create Resource Group',
        caption: 'Configuring Name Contains nginx for the VM instances resource group.',
        timestamp: '1:16 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-16-50_d8eb97db.png',
        title: 'Group Dashboard & Inventory',
        caption: 'Cloud Monitoring automatically populating Disks and VM Instances for the group.',
        timestamp: '1:16 PM',
      },
    ],
  },
  {
    id: 5,
    number: '05',
    title: 'Create & Test an Uptime Check',
    summary: 'Probed the VM instances group over HTTP port 80 every minute and verified 200 (OK) in 3 ms.',
    firstPersonNote:
      'Internal CPU metrics tell you how a server feels, but uptime checks tell you what users actually experience. I pointed My Uptime check at the VM instances group on HTTP port 80 (path /) every 60 seconds, wired failures to the Tester email channel, and ran the live connection test—which returned 200 (OK) in 3 ms.',
    steps: [
      'Opened Uptime checks > + Create uptime check.',
      'Set Protocol: HTTP, Resource Type: Instance, Applies To: Group (VM instances), Check Frequency: 1 minute.',
      'Enabled Alert & Notification and attached the Tester email channel.',
      'Titled the check My Uptime check, clicked Test, verified Responded with "200 (OK)" in 3 ms, and clicked Create.',
    ],
    configTable: [
      { property: 'Title & Check ID', value: 'My Uptime check (my-uptime-check-fhwa29CMPYM)' },
      { property: 'Target & Protocol', value: 'HTTP · Instance Group: VM instances' },
      { property: 'Path & Port', value: '/ on Port 80 (10s timeout)' },
      { property: 'Frequency & Regions', value: '60s · Global (Asia Pacific, Europe, Americas)' },
      { property: 'Test Verification', value: 'Responded with "200 (OK)" in 3 ms' },
    ],
    screenshots: [
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-23-41_1e2e2d91.png',
        title: 'Uptime Alert Notification',
        caption: 'Binding the Tester email notification channel to uptime failures.',
        timestamp: '1:23 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-24-22_b7164ba4.png',
        title: 'Review Uptime Check',
        caption: 'Naming the check My Uptime check prior to running the pre-flight test.',
        timestamp: '1:24 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-24-43_a9bfc689.png',
        title: 'Connection Test Passed',
        caption: 'Live probe confirmation: Responded with "200 (OK)" in 3 ms.',
        timestamp: '1:24 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-24-59_1b209b4d.png',
        title: 'Uptime Checks Overview',
        caption: 'My Uptime check listed with 1 associated alert policy across global regions.',
        timestamp: '1:24 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-25-06_47175ce2.png',
        title: 'Uptime Check Details',
        caption: 'Detailed configuration card showing Check ID, HTTP Port 80, 60s interval, and Global regions.',
        timestamp: '1:25 PM',
      },
    ],
  },
  {
    id: 6,
    number: '06',
    title: 'Disable Alerting Policies',
    summary: 'Cleanly turned off active alerting policies before concluding the temporary lab session.',
    firstPersonNote:
      'Alerting policies stay active even while a cloud project winds down. As good operational hygiene, I navigated back to Alerting > Policies and disabled the policies so no stale notifications fire after the lab environment is recycled.',
    steps: [
      'Opened Monitoring > Alerting and clicked See all policies.',
      'Located My Alert Policy and My Uptime check uptime failure.',
      'Clicked the Enabled toggle and confirmed Turn off in the confirmation dialog.',
    ],
    configTable: [
      { property: 'Policies Reviewed', value: 'My Alert Policy, My Uptime check uptime failure' },
      { property: 'Final Action', value: 'Disabled via Enabled toggle -> Turn off' },
    ],
    screenshots: [
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-25-47_40ebd372.png',
        title: 'Active Alert Policies',
        caption: 'Both My Alert Policy and My Uptime check uptime failure enabled on November 27, 2026.',
        timestamp: '1:25 PM',
      },
      {
        src: '/assets/aistudio/Screenshot_From_2026-11-27_13-26-04_c954abe5.png',
        title: 'Policy Disabled Confirmation',
        caption: 'Policies toggled off cleanly with the "Policy disabled" confirmation banner.',
        timestamp: '1:26 PM',
      },
    ],
  },
  {
    id: 7,
    number: '07',
    title: 'Lab Review & SRE Synthesis',
    summary: 'Consolidated dashboards, multi-condition alerts, dynamic groups, and uptime checks into this repo.',
    firstPersonNote:
      'Completing all objectives reinforced how Google Cloud Monitoring layers observability from infrastructure to user-facing availability: raw VM telemetry feeds dashboards and Metrics Explorer, dynamic groups keep targets resilient to scaling, multi-condition policies suppress noise, and uptime checks validate real HTTP reachability.',
    steps: [
      'Explored Google Cloud Observability Monitoring navigation and scopes.',
      'Built custom dashboards (My Dashboard / My Chart) and validated metrics in Metrics Explorer.',
      'Created multi-condition alerting (My Alert Policy) with email delivery.',
      'Configured dynamic resource grouping (VM instances) and HTTP uptime probing (My Uptime check).',
    ],
    screenshots: [],
  },
];

export const KNOWLEDGE_CHECKS: KnowledgeQuestion[] = [
  {
    id: 'kc-1',
    taskRef: 'Task 2 · SRE Foundations',
    question: 'Why is monitoring important to Google?',
    multiSelect: false,
    options: [
      {
        id: 'kc-1-a',
        label: 'Google uses monitoring solely to assemble broad compliance reports for external customers.',
        correct: false,
      },
      {
        id: 'kc-1-b',
        label:
          'It is at the base of site reliability, applying software engineering to operations to build ultra-scalable and highly reliable systems.',
        correct: true,
      },
      {
        id: 'kc-1-c',
        label: 'Monitoring only exists to satisfy government and industry security regulations.',
        correct: false,
      },
    ],
    explanation:
      'In Google SRE practice, monitoring is the foundational layer of the service reliability hierarchy—without reliable telemetry, teams cannot measure SLIs/SLOs or respond effectively to incidents.',
  },
  {
    id: 'kc-2',
    taskRef: 'Task 3 · Alerting Strategy',
    question: 'Which strategies effectively reduce alert fatigue? (Select all that apply)',
    multiSelect: true,
    options: [
      {
        id: 'kc-2-a',
        label: 'Report all noise so every single data point is presented.',
        correct: false,
      },
      {
        id: 'kc-2-b',
        label: 'Customize your alerts to the audience need.',
        correct: true,
      },
      {
        id: 'kc-2-c',
        label: 'Configure alerting on symptoms and not necessarily causes.',
        correct: true,
      },
      {
        id: 'kc-2-d',
        label: 'Use multiple notification channels to avoid a single point of failure.',
        correct: false,
      },
    ],
    explanation:
      'Paging engineers on high-level symptoms (like failing HTTP checks or sustained multi-condition CPU saturation) and tailoring alerts to the receiving team directly eliminates noisy false positives.',
  },
  {
    id: 'kc-3',
    taskRef: 'Task 5 · Uptime Notifications',
    question: 'Select all valid targets for Cloud Monitoring uptime alert notifications.',
    multiSelect: true,
    options: [
      { id: 'kc-3-a', label: 'Pub/Sub', correct: true },
      { id: 'kc-3-b', label: '3rd party service (PagerDuty, Slack, etc.)', correct: true },
      { id: 'kc-3-c', label: 'Email', correct: true },
      { id: 'kc-3-d', label: 'SMS', correct: true },
      { id: 'kc-3-e', label: 'EC2 service', correct: false },
      { id: 'kc-3-f', label: 'Webhook', correct: true },
    ],
    explanation:
      'Cloud Monitoring supports Email, SMS, Pub/Sub topics, Webhooks, Cloud Mobile App, and 3rd party integrations like Slack or PagerDuty. EC2 service is an AWS compute resource, not a notification target.',
  },
];

export const README_MARKDOWN = `# Monitor Resources with Google Cloud Observability

**Author:** Muhammed Abdulazeez  
**Contact:** \`muhammedabdulazeez770@gmail.com\`  
**Lab Project ID:** \`qwiklabs-gcp-02-8b757eb619d7\`  
**Completed:** November 27, 2026  

---

## Overview

In this hands-on Google Cloud lab, I configured end-to-end observability across a three-node NGINX Compute Engine fleet using **Google Cloud Monitoring**. Rather than treating monitoring as passive graphs, I structured the workflow around core Site Reliability Engineering (SRE) practices: visualizing real-time CPU utilization on a custom dashboard, reducing alert fatigue with a multi-condition alerting policy, organizing instances dynamically through resource groups, verifying external availability with global HTTP uptime checks, and cleanly decommissioning alert policies after validation.

This repository also includes an **interactive web companion** built with React, TypeScript, and Tailwind CSS so anyone reviewing this project on Vercel can explore every screenshot I captured, test the multi-condition alert thresholds, filter the dynamic resource group, and run simulated uptime checks directly in the browser.

---

## Objectives Completed

- Verified three pre-provisioned Compute Engine VM instances (\`nginxstack-1\`, \`nginxstack-2\`, \`nginxstack-3\`) running in \`us-west1-a\`.
- Built a custom dashboard (\`My Dashboard\`) and configured a line chart (\`My Chart\`) tracking \`VM Instance - CPU utilization\`, then cross-checked metrics in **Metrics Explorer**.
- Created a multi-condition alerting policy (\`My Alert Policy\`) combining \`CPU usage\` and \`CPU utilization\` thresholds above \`20\` over a \`1 min\` rolling window with \`All conditions are met\`, routed to my email notification channel (\`Tester\`).
- Organized the fleet into a dynamic resource group (\`VM instances\`) matching instances whose name contains \`nginx\`.
- Configured and tested an HTTP uptime check (\`My Uptime check\`) targeting the \`VM instances\` group on port \`80\` every \`60s\`, verifying a \`200 (OK)\` response in \`3 ms\`.
- Disabled the active alerting policies at lab teardown to follow clean post-lab hygiene.

---

## Infrastructure Inventory

| Instance Name | Zone | Machine Type | Internal IP | External IP | Baseline CPU Usage | Baseline CPU Utilization |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| \`nginxstack-1\` | \`us-west1-a\` | \`e2-micro\` | \`10.138.0.4\` | \`136.66.120.74\` | \`0.005\` – \`0.009\` | \`1.962%\` |
| \`nginxstack-2\` | \`us-west1-a\` | \`e2-micro\` | \`10.138.0.2\` | \`136.86.196.149\` | \`0.005\` | \`2.174%\` |
| \`nginxstack-3\` | \`us-west1-a\` | \`e2-micro\` | \`10.138.0.3\` | \`35.247.56.3\` | \`0.021\` – \`0.030\` | \`12.032%\` |

---

## Step-by-Step Walkthrough

### Task 1. Verify Compute Engine Resources

I started by navigating to **Compute Engine > VM instances** in the Google Cloud console to confirm that all three target NGINX nodes (\`nginxstack-1\`, \`nginxstack-2\`, and \`nginxstack-3\`) were running and reachable in \`us-west1-a\`.

![VM Instances Verified](./public/assets/aistudio/Screenshot_From_2026-11-27_12-55-59_5a39feac.png)

---

### Task 2. Create Custom Dashboards & Explore Metrics

Next, I opened **Observability > Monitoring > Dashboards** and created a new custom dashboard named **\`My Dashboard\`**.

1. Selected **Add widget > Line** and titled the widget **\`My Chart\`**.
2. Selected the **\`VM Instance > Instance > CPU utilization\`** metric (\`compute.googleapis.com/instance/cpu/utilization\`).
3. Inspected the time series across all three instances, then recreated the view inside **Metrics Explorer** to inspect ad-hoc metric behavior without persisting a widget.

> **SRE Takeaway:** Monitoring sits at the foundation of Site Reliability Engineering—applying software engineering principles to operations in order to build ultra-scalable, reliable systems.

---

### Task 3. Create Multi-Condition Alerting Policies

To catch sustained CPU anomalies without flooding on-call channels with noisy single-metric spikes, I configured **\`My Alert Policy\`** under **Monitoring > Alerting**:

1. **Condition 1 — \`VM Instance - CPU usage\`:** Rolling window \`1 min\` (\`mean\`), Threshold \`Above threshold\` at \`20\`.
2. **Condition 2 — \`VM Instance - CPU utilization\`:** Rolling window \`1 min\` (\`mean\`), Threshold \`Above threshold\` at \`20%\`.
3. **Multi-condition trigger:** Set to **\`All conditions are met\`** (the same resource must violate both conditions).
4. **Notification Channel:** Created an Email channel (\`Tester\` -> \`muhammedabdulazeez8011@gmail.com\`) via **Manage Notification Channels**, refreshed the list, and attached it to the policy.

---

### Task 4. Create Resource Groups

To manage and monitor the NGINX instances as a single logical unit rather than tracking individual host IDs, I created a resource group under **Monitoring > Groups**:

- **Group Name:** \`VM instances\`
- **Criterion:** \`Name\` \`Contains\` \`nginx\`

Cloud Monitoring automatically grouped \`nginxstack-1\`, \`nginxstack-2\`, and \`nginxstack-3\` together along with their attached disks and built-in group metrics view.

---

### Task 5. Create & Test an Uptime Check

With the \`VM instances\` group ready, I created an external availability probe under **Monitoring > Uptime checks**:

| Property | Configured Value |
| :--- | :--- |
| **Title** | \`My Uptime check\` |
| **Protocol** | \`HTTP\` |
| **Resource Type** | \`Instance\` |
| **Applies To** | \`Group\` -> \`VM instances\` |
| **Path / Port** | \`/\` on Port \`80\` |
| **Check Frequency** | \`1 minute\` (\`60s\`) |
| **Alert & Notification** | \`Tester\` (Email) |

Before clicking **Create**, I ran the **Test** action and verified \`Responded with "200 (OK)" in 3 ms\`.

---

### Task 6. Disable Alerting Policies

Because Cloud Monitoring alerting policies remain active even after temporary lab environments wind down, I opened **Monitoring > Alerting > Policies** and toggled the alert policies off cleanly (\`Policy disabled\`).

---

## Interactive Web App & Vercel Deployment

This repository ships with a Vite + React + TypeScript interactive lab companion that turns my walkthrough into a live sandbox.

\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`

Deploy directly to Vercel using the included \`vercel.json\` configuration.

---

*Documented and built by **Muhammed Abdulazeez**.*`;
