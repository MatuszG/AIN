set style data lines
set xlabel "Generation"
set ylabel "Average total payoff (ATP)"
plot 'm_result_1.txt' using 1:2 with lines lc 3 lw 3  title "Best fit",\
 'm_result_1.txt' using 1:3 with lines lc 2 lw 3 title "Avg fit"