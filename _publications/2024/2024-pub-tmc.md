---
title:          "Making Serverless Not So Cold in Edge Clouds: A Cost-Effective Online Approach"
date:           2024-01-17 00:01:00 +0800
selected:       true
pub:            "IEEE Transactions on Mobile Computing (TMC)"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Spotlight</span>'
pub_date:       "2024"

abstract: >-
  Applying the serverless paradigm to edge computing improves edge resource utilization while bringing the benefits of flexible scaling and pay-as-you-go to latency-sensitive applications. This extends the boundaries of serverless computing and improves the quality of service for Function-as-a-Service users. However, as an emerging cloud computing paradigm, serverless edge computing faces pressing challenges, with one of the biggest obstacles being delay caused by excessively long container cold starts...
# Cold start delay is defined as the time between when a serverless function is triggered and when it begins to execute, and its existence seriously impacts resource utilization and Quality of Service (QoS). In this article, we study how to minimize the total system cost by caching function containers and selecting routes for neighboring functions via edge or public clouds. We prove that the proposed problem is NP-hard even in the special case where the user request contains only one function, and that the unpredictability of user requests and the impact between adjacent time decisions require that the problem to be solved in an online fashion. We then design the Online Lazy Caching algorithm, an online algorithm with a worst-case competitive ratio using a randomized dependent rounding algorithm to solve the problem. Extensive simulation results show that the proposed online algorithm can achieve close-to-optimal performance in terms of both total cost and cold start cost compared to other existing algorithms, with average improvements of 31.6$\%$ and 51.7$\%$.
cover:          /assets/images/covers/tmc_system_figure.png
authors:
  - Ke Xiao
  - Song Yang
  - Fan Li
  - Liehuang Zhu
  - Xu Chen
  - Xiaoming Fu
links:
  # Code: https://github.com/luost26/academic-homepage
  # Unsplash: https://unsplash.com/photos/sliced-in-half-pineapple--_PLJZmHZzk
---
