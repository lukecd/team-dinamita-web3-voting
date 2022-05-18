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

  useEffect(() => {
    console.log(windowSize);
  }, [windowSize]);

  const data = {
    labels: options.map((option) => option.name),
    datasets: [
      {
        label: "# of Votes",
        data: options.map((option) => option.votes),
        backgroundColor: [
          "rgba(255, 99, 132, 0.35)",
          "rgba(54, 162, 235, 0.35)",
          "rgba(153, 102, 255, 0.35)",
          "rgba(255, 159, 64, 0.35)",
          "rgba(255, 206, 86, 0.35)",
          "rgba(75, 192, 192, 0.35)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const ancho = windowSize.width >= 1440 ? 900 : 350;
  const alto = windowSize.height >= 900 ? 900 : 350;

  return (
    <div className=" w-full h-full">
      <Doughnut
        data={data}
        width={ancho}
        height={alto}
        options={{ maintainAspectRatio: false, responsive: true }}
      />
    </div>
  );
}
