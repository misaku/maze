Variable meanings in function maze:
x,y — dimensions of maze

n — number of openings to be generated

horiz — two dimensional array of locations of horizontal openings (true means wall is open)

verti — two dimensional array of locations of vertical openings (true means wall is open)

here — current location under consideration

path — history (stack) of locations that might need to be revisited

unvisited — two dimensional array of locations that have not been visited, padded to avoid need for boundary tests (true means location needs to be visited)

potential — locations adjacent to here

neighbors — unvisited locations adjacent to here

Variable meanings in function display:

m — maze to be drawn

text — lines of text representing maze

line — characters of current line

Note that this implementation relies on javascript arrays being treatable as infinite in size with false (null) values springing into existence as needed, to support referenced array locations. (This significantly reduces the bulk of the necessary initialization code.)
