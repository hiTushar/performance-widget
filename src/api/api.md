## performace data api
### GET `/performance/data?t=timestamp`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| t | number | timestamp |

#### Response

```json
[
    {
        "param_id": "health",
        "param_name": "Health Score",
        "param_score": 0,
        "last_week_score": 0, 
        "children": [ "energy1", "memory1", "connectivity1" ],
        "primary": true
    },    
    {
        "param_id": "energy1",
        "param_name": "Energy Score1",
        "param_score": 0,
        "last_week_score": 0,
        "children": [ "internet11", "battery11", "overheating11" ],
        "primary": false
    },
    {
        "param_id": "memory1",
        "param_name": "Memory Score1",
        "param_score": 0,
        "last_week_score": 0,
        "children": [ "internet12", "battery12", "overheating12" ],
        "primary": false
    },
    {
        "param_id": "connectivity1",
        "param_name": "Connectivity Score1",
        "param_score": 0,
        "last_week_score": 0,
        "children": [ "internet13", "battery13", "overheating13" ],
        "primary": false
    }, 
    ...
]
```

## performance score api
### GET `/performance/score?t=timestamp`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| t | number | timestamp |

#### Response

```json
{
    "total_score": 100,
    "score": 53,
    "last_week_score": 50
}
```