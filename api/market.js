export default async function handler(req, res) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "TWELVE_DATA_API_KEY is not configured"
    });
  }

  const symbol = req.query.symbol || "XAU/USD";
  const interval = req.query.interval || "5min";

  const allowedIntervals = [
    "1min",
    "5min",
    "15min",
    "30min",
    "1h",
    "1day",
    "1week"
  ];

  if (!allowedIntervals.includes(interval)) {
    return res.status(400).json({
      error: "Invalid interval"
    });
  }

  const url = new URL(
    "https://api.twelvedata.com/time_series"
  );

  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("outputsize", "500");
  url.searchParams.set("timezone", "UTC");
  url.searchParams.set("apikey", apiKey);

  try {

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok || data.status === "error") {

      return res.status(502).json({
        error:
          data.message ||
          "Twelve Data API error"
      });

    }

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      error:
        "Unable to connect to market data provider"
    });

  }
}
