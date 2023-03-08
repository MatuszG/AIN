set style data lines
set xlabel "History"
set ylabel "Frequency of game histories"
plot 'result_2_gen_60.txt' using 1:2 with lines lc 3 lw 3  title "Frequency of game histories"