set style data lines
set xlabel "Generation"
set ylabel "Average total payoff (ATP)"
plot 'std_result_1.txt' using 1:2 with lines lc 3 lw 3  title "avg best",\
 'std_result_1.txt' using 1:2:3 with yerrorbars lc 2 lw 3 title "std best"