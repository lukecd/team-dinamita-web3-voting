import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart({ options }) {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
  }, []);

  const data = {
    labels: options.map((option) => option.name),
    datasets: [
      {
        label: "# of Votes",
        data: options.map((option) => option.votes),
        backgroundColor: [
          "rgba(75,192,192,0.5)",
          "rgba(153,102,255,0.5)",
          "rgba(54,162,235,0.5)",
          "rgba(241,90,34,0.5)",
          "rgba(255,99,132,0.5)",
          "rgba(255,159,10,0.5)",
          "rgba(255,206,86,0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(241, 90, 34, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const ancho = windowSize.width >= 1440 ? 1500 : 350;
  const alto = windowSize.height >= 900 ? 1500 : 350;

  return (
    <div className=" w-full h-full drop-shadow-[2px_2px_10px_rgba(255,255,255,0.25)]">
      <Doughnut
        data={data}
        width={ancho}
        height={alto}
        options={{ maintainAspectRatio: false, responsive: true }}
      />
    </div>
  );
}
