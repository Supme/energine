<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet 
    version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  
    xmlns="http://www.w3.org/1999/xhtml">

    <!--
        В этом файле собраны базовые правила обработки с низким приоритетом. Файл импортируется в include.xslt,
        что позволяет использовать правило apply-imports в шаблонах более высокого уровня.        
    -->
    
    <!-- переопределение fields для компонентов из модуля shop -->
    <!-- компонент ProductEditor -->    
    <xsl:template match="field[@name='product_price'][ancestor::component[@class='ProductEditor'][@type='form']]">
        <input style="width: 50px;">
            <xsl:call-template name="FORM_ELEMENT_ATTRIBUTES"/>
        </input>
        <xsl:variable name="CURRENCY_SELECTOR" select="../field[@name='curr_id']"></xsl:variable>
        <select id="{$CURRENCY_SELECTOR/@name}" style="width: 200px;">
            <xsl:attribute name="name">
                <xsl:choose>
                    <xsl:when test="$CURRENCY_SELECTOR/@tableName"><xsl:value-of select="$CURRENCY_SELECTOR/@tableName" />[<xsl:value-of select="$CURRENCY_SELECTOR/@name" />]</xsl:when>
                    <xsl:otherwise><xsl:value-of select="$CURRENCY_SELECTOR/@name" /></xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <xsl:if test="$CURRENCY_SELECTOR/@nullable='1'">
                <option></option>
            </xsl:if>
            <xsl:for-each select="$CURRENCY_SELECTOR/options/option">
                <option value="{@id}">
                    <xsl:if test="@selected">
                        <xsl:attribute name="selected">selected</xsl:attribute>
                    </xsl:if>
                    <xsl:value-of select="."/>
                </option>
            </xsl:for-each>
        </select>
    </xsl:template>
    <!-- /компонент ProductEditor -->

</xsl:stylesheet>