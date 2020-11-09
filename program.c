#include <stdlib.h>
#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>
#include <math.h>
#define MAX_ROWS 1003
#define MAX_COLUMNS 1003
#define MAX_STRINGLENGTH 100

struct Delim // struct for delim
{
    char *value;
    int length; // lenght
    /* data */
};

struct Delim delim;
int argc_g;
char **argv_g;
int currentCLArg = 0;

char table[MAX_ROWS][MAX_COLUMNS][MAX_STRINGLENGTH]; //max possible size of table
int rows, columns;

void initDelim() // function for delim initialization
{
    delim.length = 1;
    delim.value = " ";

    //strcmp str comapier: -1/0/1
    //strlen length of string
    if (argc_g == 1)
        return;
    int isFirstArgumentD = strcmp(argv_g[1], "-d");
    if (isFirstArgumentD == 0)
    {
        delim.value = argv_g[2];          //
        delim.length = strlen(argv_g[2]); //
        currentCLArg += 3;                //
    }
    else
    {
        currentCLArg++; //next comand line argument
    }
}

//if it possible to read word from comand line
bool isCLFinished()
{
    bool result = currentCLArg < argc_g;
    // if (result == false)
    //     printf(" ERROR, %d index %d\n", argc_g, currentCLArg);
    return !result; //return
}

int readIntAttribute() // possibility to read argument (int type)
{
    currentCLArg++;
    if (isCLFinished())
        return -1;
    /**
     * 
     */
    char *stopped; //

    /**
     * whrite number from cl to buffer  
     * if error -> whrite smth to *stopped. 10 count system 
     */
    int buffer = (int)strtol(argv_g[currentCLArg], &stopped, 10);
    if (*stopped)
    {
        printf("\n Cant read attribute %s, one of possible reason is lack of null-char \n", argv_g[currentCLArg]);
        return false;
    }
    return buffer;
}

char *readStrAttribute() // possibility to read argument from cl (string)
{
    currentCLArg++;
    if (isCLFinished())
    {
        printf("Cant read next word\n");
        return NULL;
    }

    return argv_g[currentCLArg];
}
// functions for "uprava tabulky"
void irow(int r)
{
    rows += 1;
    for (int i = rows; i >= r; i--)
    {
        for (int j = 0; j < columns; j++)
        {
            strcpy(table[i + 1][j], table[i][j]);
        }
    }

    for (int i = 0; i < columns; i++)
    {
        strcpy(table[r][i], "");
    }
}
void drow(int r)
{
    rows -= 1;
    for (int i = r; i < rows; i++)
    {
        for (int j = 0; j < columns; j++)
        {
            strcpy(table[i][j], table[i + 1][j]);
        }
    }
}
void drows(int n, int m)
{

    int k = m + 1;

    for (int i = 0; k < rows; i++)
    {
        for (int j = 0; j < columns; j++)
        {
            strcpy(table[i][j], table[k][j]);
        }
        k++;
    }
    rows = rows - (m - n + 1);
}
void icol(int c)
{
    for (int i = 0; i < rows; i++)
    {

        for (int j = columns; j >= c; j--)
        {
            strcpy(table[i][j + 1], table[i][j]);
        }
    }
    columns += 1;
    for (int i = 0; i < columns; i++)
    {
        strcpy(table[i][c], "");
    }
}

void dcol(int c)
{

    for (int i = 0; i < rows; i++)
    {
        for (int j = c; j < columns; j++)
        {
            strcpy(table[i][j - 1], table[i][j]);
        }
    }
    columns--;
}

/**
 * This function removes range of columns
 */
void dcols(int n, int m)
{
    for (int i = 0; i < rows; i++)
    {
        int k = m + 1;

        for (int j = n; k < columns; j++)
        {
            strcpy(table[i][j], table[i][k]);
            k++;
        }
    }
    columns = columns - (m - n + 1);
}

void processEditCL() //
{
    bool nothingToRead = isCLFinished();
    bool changesApplied = false;
    /**
     * if string with cl arguments is over -> go away from this function
     */
    while (!nothingToRead && !changesApplied)
    {
        char *currentCommand = argv_g[currentCLArg]; //

        if (strcmp(currentCommand, "irow") == 0)
        {                                 //
            int row = readIntAttribute(); //
            irow(row - 1);
            changesApplied++;
        }
        if (strcmp(currentCommand, "arow") == 0)
        {
            rows += 1;
            changesApplied++;
        }
        if (strcmp(currentCommand, "drow") == 0)
        {
            int row = readIntAttribute();
            drow(row - 1);
            changesApplied++;
        }
        if (strcmp(currentCommand, "drows") == 0)
        {
            int n = readIntAttribute();
            int m = readIntAttribute();
            if (m > n)
            {
                printf("Druhe cislo musi byt >= prvniho \n");
            }
            drows(n - 1, m - 1);
            changesApplied++;
        }
        if (strcmp(currentCommand, "icol") == 0)
        {
            int row = readIntAttribute();
            icol(row - 1);
            changesApplied++;
        }
        if (strcmp(currentCommand, "acol") == 0)
        {
            columns += 1;
            changesApplied++;
        }
        if (strcmp(currentCommand, "dcol") == 0)
        {
            int row = readIntAttribute();
            dcol(row);
            changesApplied++;
        }
        if (strcmp(currentCommand, "dcols") == 0)
        {
            int n = readIntAttribute();
            int m = readIntAttribute();
            if (m < n)
            {
                printf("Druhe cislo musi byt >= prvniho \n");
                return;
            }
            dcols(n - 1, m - 1);
            changesApplied++;
        }

        if (!changesApplied)
            break;

        changesApplied = false;
        currentCLArg++;
        nothingToRead = isCLFinished();
    }
}
//functions for "zpracovani dat"
double stringToDouble(char *str)
{
    char *errors;
    double output = strtod(str, &errors);

    return output;
}

void cset(int i, int c, char *str)
{
    strcpy(table[i][c], str);
}

void tableRound(int i, int c)
{
    double cell = stringToDouble(table[i][c]);
    double roundedCell = round(cell);
    sprintf(table[i][c], "%0.f", roundedCell);
}

void tableTolower(int i, int c)
{
    for (int j = 0; j < MAX_STRINGLENGTH; j++)
    {
        table[i][c][j] = tolower(table[i][c][j]);
    }
}

void tableToupper(int i, int c)
{
    for (int j = 0; j < MAX_STRINGLENGTH; j++)
    {
        table[i][c][j] = toupper(table[i][c][j]); //idk if i should to use asci table , but we ve got this function in ctype.h
    }
}

void tableCopy(int i, int n, int m)
{
    strcpy(table[i][m], table[i][n]);
}

void tableInt(int i, int c)
{

    char *endPTR;

    double buffer = strtod(table[i][c], &endPTR);
    if (strcmp(endPTR, "") == 0)
    {
        sprintf(table[i][c], "%d", (int)trunc(buffer));
    }
}

void tableSwap(int i, int n, int m)
{
    char buffer[MAX_STRINGLENGTH];

    strcpy(buffer, table[i][n]);
    strcpy(table[i][n], table[i][m]);
    strcpy(table[i][m], buffer);
}

bool processDataCL()
{

    if (isCLFinished())
        return false;

    char *currentCommand = argv_g[currentCLArg];
    // Proccess if we have `rows` or `beginwith` or `contains`

    int startIndex = 0, endIndex = rows;
    int beginC = -1;
    char *beginSTR;

    int containsC = -1;
    char *containsSTR;
    // functions for "selekce radku"
    if (strcmp(currentCommand, "rows") == 0)
    {
        startIndex = readIntAttribute() - 1;
        endIndex = readIntAttribute();

        currentCLArg++;
        currentCommand = argv_g[currentCLArg];
    }

    if (strcmp(currentCommand, "beginwith") == 0)
    {
        beginC = readIntAttribute() - 1;
        beginSTR = readStrAttribute();

        currentCLArg++;
        currentCommand = argv_g[currentCLArg];
    }

    if (strcmp(currentCommand, "contains") == 0)
    {
        containsC = readIntAttribute() - 1;
        containsSTR = readStrAttribute();

        currentCLArg++;
        currentCommand = argv_g[currentCLArg];
    }

    // Here the commands start
    int c, n, m;
    char *str;

    for (int i = startIndex; i < endIndex; i++)
    {
        if (beginC != -1)
        {
            // Here you get the position number for the substring in the string. if in positionOfBEginStr goes 0 - than work with this table string
            // else skip the loop(cyklus) iteration
            char positionOfBeginStr = strstr(table[i][beginC], beginSTR) - table[i][beginC];

            if (positionOfBeginStr != 0)
                continue;
        }

        if (containsC != -1)
        {
            char *exists = strstr(table[i][containsC], containsSTR);
            if (exists == NULL)
                continue;
        }

        if (strcmp(currentCommand, "cset") == 0)
        {
            if (i == startIndex)
            {
                c = readIntAttribute();
                str = readStrAttribute();
            }

            cset(i, c - 1, str);
        }

        if (strcmp(currentCommand, "tolower") == 0)
        {
            if (i == startIndex)
                c = readIntAttribute();

            tableTolower(i, c - 1);
        }

        if (strcmp(currentCommand, "toupper") == 0)
        {
            if (i == startIndex)
                c = readIntAttribute();

            tableToupper(i, c - 1);
        }

        if (strcmp(currentCommand, "round") == 0)
        {
            if (i == 0)
                c = readIntAttribute();

            tableRound(i, c - 1);
        }

        if (strcmp(currentCommand, "swap") == 0)
        {
            if (i == startIndex)
            {
                n = readIntAttribute();
                m = readIntAttribute();
            }
            tableSwap(i, n - 1, m - 1);
        }

        if (strcmp(currentCommand, "copy") == 0)
        {
            if (i == startIndex)
            {
                n = readIntAttribute();
                m = readIntAttribute();
            }
            tableCopy(i, n - 1, m - 1);
        }
        if (strcmp(currentCommand, "int") == 0)
        {
            if (i == startIndex)
                c = readIntAttribute();

            tableInt(i, c - 1);
        }
    }

    return false;
}

// Determining the position of the character in the string, for the string ABC, the character " b " will be 2
int positionOfCharacterInString(char *haystack, char needle)
{
    int i = 0;
    while (i != strlen(haystack)) // while strlen of arr haystack wont be i, repeat
    {
        if (haystack[i] == needle)
        {
            return i;
        }
        i++;
    }
    return -1;
}

// deleting repeting symbols in string
char *uniqCharacters(char *string)
{
    char *output = malloc(strlen(string)); // make a memory for (strlen(string))
    int indexatorOfOutput = 0;

    for (int i = 0; i < strlen(string); i++) //
    {
        int positionInOutput = positionOfCharacterInString(output, string[i]);
        if (positionInOutput == -1)
        {
            output[indexatorOfOutput] = string[i];
            indexatorOfOutput++;
        }
    }

    return output;
}
size_t substrCount(char *str, char *substr)
{
    printf(" Created new array");

    int countInSub = strlen(str);
    printf(" Created new array");

    char *firsLine = malloc(strlen(str));
    // strcpy(firsLine, str);
    int endOfFirstLine = 0;

    for (; str[endOfFirstLine] != '\n'; endOfFirstLine++)
    {
        firsLine[endOfFirstLine] = str[endOfFirstLine];
    }
    printf("%s", firsLine);

    return 0;
}
// function for posibility to read the table
void readTable()
{
    char row[10240];

    int IsPossibleToRead = scanf("%s", row);
    int i;
    while (IsPossibleToRead > 0)
    {

        char *bufferString = strtok(row, delim.value);

        while (bufferString != NULL)
        {
            if (rows == 0)
            {
                columns++;
            }

            strcpy(table[rows][i], bufferString);
            bufferString = strtok(NULL, delim.value);
            i++;
        }
        IsPossibleToRead = scanf("%s", row);
        rows++;

        i = 0;
    }
}

void writeTable()
{
    int i;
    for (i = 0; i < rows; i++)
    {
        int j = 0;
        for (; j < columns; j++)
        {
            printf("%s", table[i][j]);
            if (j < columns - 1)
                printf("%s", delim.value);
        }
        printf("\n");
    }
}

int main(int argc, char *argv[])
{
    argc_g = argc; // pro zjednoduseni funkci,kde to potrebujeme
    argv_g = argv;

    initDelim(argc, argv);
    delim.value = uniqCharacters(delim.value);

    readTable();

    processEditCL();
    bool isPossibleFurther = processDataCL();

    while (isPossibleFurther)
    {
        isPossibleFurther = processDataCL();
    }
    writeTable();
    return 0;
}
